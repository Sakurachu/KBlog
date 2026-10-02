import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");
const loaded = new Map();
let admin = true;
let revalidations = 0;
const categories = [];
const posts = [];

// Exercise the actual Server Actions against a small database double. No live data is written.
function query(table) {
  const rows = table === "categories" ? categories : posts;
  let operation = "read",
    payload,
    condition;
  const execute = () => {
    if (operation === "insert") {
      if (
        rows.some(
          (row) =>
            row.slug === payload.slug ||
            (table === "categories" && row.name === payload.name),
        )
      )
        return { data: null, error: { code: "23505" } };
      const row = { ...payload, id: `database-${table}-${rows.length}` };
      rows.push(row);
      return { data: row, error: null };
    }
    const row = rows.find(
      (item) => !condition || item[condition[0]] === condition[1],
    );
    if (operation === "update" && row) Object.assign(row, payload);
    return { data: row ?? null, error: null };
  };
  const chain = {
    select() {
      return chain;
    },
    eq(key, value) {
      condition = [key, value];
      return chain;
    },
    insert(value) {
      operation = "insert";
      payload = value;
      return chain;
    },
    update(value) {
      operation = "update";
      payload = value;
      return chain;
    },
    async maybeSingle() {
      return execute();
    },
    async single() {
      return execute();
    },
    then(resolve, reject) {
      return Promise.resolve(execute()).then(resolve, reject);
    },
  };
  return chain;
}

function load(relative) {
  if (loaded.has(relative)) return loaded.get(relative);
  const testModule = { exports: {} };
  loaded.set(relative, testModule.exports);
  const filename = path.join(root, relative);
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const dependency = (id) => {
    if (id === "next/cache")
      return {
        revalidatePath() {
          revalidations++;
        },
      };
    if (id === "next/headers") return { headers: async () => new Map() };
    if (id === "next/navigation")
      return {
        redirect(url) {
          throw new Error(`REDIRECT:${url}`);
        },
      };
    if (id === "@/lib/data")
      return {
        getCurrentUser: async () =>
          admin
            ? { user: { id: "author" }, profile: { role: "admin" } }
            : { user: null, profile: null },
        getCategories: async () => [
          ...load("src/lib/columns.ts").defaultColumnCategories,
          ...load("src/lib/editorial-data.ts").editorialCategories,
        ],
      };
    if (id === "@/lib/supabase/server")
      return { createClient: async () => ({ from: query }) };
    if (id.startsWith("@/")) return load(`src/${id.slice(2)}.ts`);
    return require(id);
  };
  vm.runInThisContext(`(function(require,module,exports){${outputText}\n})`, {
    filename,
  })(dependency, testModule, testModule.exports);
  loaded.set(relative, testModule.exports);
  return testModule.exports;
}

const {
  buildColumns,
  columnForCategory,
  categoryUrl,
  defaultColumnCategories,
} = load("src/lib/columns.ts");
const { editorialCategories } = load("src/lib/editorial-data.ts");
const initial = buildColumns([
  ...defaultColumnCategories,
  ...editorialCategories,
]);
assert.deepEqual(
  initial.map((column) => column.slug),
  ["precision", "notes", "life"],
);
assert.equal(
  columnForCategory(editorialCategories[0], initial).slug,
  "precision",
);
assert.equal(
  categoryUrl(editorialCategories[0], initial),
  "/sections/alignment-basics",
);
assert.equal(
  categoryUrl(defaultColumnCategories[1], initial),
  "/columns/notes",
);

const { saveColumnAction, savePostAction } = load("src/app/actions.ts");
const form = (values) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
};
const columnInput = {
  name: "读书札记",
  slug: "reading",
  description: "阅读记录",
  theme: "notebook",
  sortOrder: "20",
};
assert.ok((await saveColumnAction({}, form(columnInput))).success);
assert.equal(categories[0].accent, "coral");
assert.ok(
  (await saveColumnAction({}, form(columnInput))).error,
  "A duplicate column cannot overwrite an existing one.",
);
const countBeforeInvalid = categories.length;
for (const invalid of [
  { slug: "../escape" },
  { slug: "advanced-packaging" },
  { theme: "__proto__" },
  { sortOrder: "1.5" },
  { name: "x".repeat(41) },
  { name: "随笔" },
])
  assert.ok(
    (
      await saveColumnAction(
        {},
        form({ ...columnInput, slug: "fresh", ...invalid }),
      )
    ).error,
  );
assert.equal(
  categories.length,
  countBeforeInvalid,
  "Invalid requests cannot write rows.",
);
assert.ok(
  (
    await saveColumnAction(
      {},
      form({
        ...columnInput,
        editing: "yes",
        name: "读书与思考",
        theme: "gallery",
        sortOrder: "0",
      }),
    )
  ).success,
);
const customColumns = buildColumns([...defaultColumnCategories, ...categories]);
assert.equal(
  customColumns[1].slug,
  "reading",
  "Changing order affects column navigation.",
);
assert.equal(
  columnForCategory(categories[0], customColumns).theme,
  "gallery",
  "Articles inherit their column's saved theme.",
);
assert.equal(
  categories.length,
  1,
  "Renaming updates the same category instead of creating a new one.",
);

const postInput = {
  title: "一段测试文字",
  content: "这是一段足够长度的测试正文，用于检查新专栏和文章所属分类。",
  categoryId: defaultColumnCategories[0].id,
  status: "draft",
};
await assert.rejects(
  savePostAction({}, form(postInput)),
  /REDIRECT:\/studio\?saved=1/,
);
const precisionRow = categories.find(
  (category) => category.slug === "precision",
);
assert.equal(
  posts[0].category_id,
  precisionRow.id,
  "Publishing into a built-in column uses its actual database UUID.",
);
assert.equal(posts[0].status, "draft");
admin = false;
const countBeforeUnauthenticated = categories.length;
await assert.rejects(
  saveColumnAction({}, form({ ...columnInput, slug: "blocked" })),
  /REDIRECT:\/login/,
);
assert.equal(
  categories.length,
  countBeforeUnauthenticated,
  "Unauthenticated requests cannot create columns.",
);
assert.equal(revalidations, 3);
console.log(
  "Column checks passed: grouping, old links, custom themes, ordering, rename, validation, category resolution, and authorization.",
);
