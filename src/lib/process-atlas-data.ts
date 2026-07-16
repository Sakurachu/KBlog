import type { Category, Post } from "@/lib/types";

export const processAtlasCategory: Category = {
  id: "editorial-process-atlas",
  name: "精密工艺图解",
  slug: "process-atlas",
  description: "用系统结构、关键指标、工艺流程与典型不良，拆解精密制造和半导体封测。",
  accent: "teal",
};

const mlccImages = [
  ["01", "粉体与浆料制备", "01-slurry-preparation.webp"],
  ["02", "陶瓷绿片流延成型", "02-tape-casting.webp"],
  ["03", "内电极精密印刷", "03-electrode-printing.webp"],
  ["04", "绿片高精度叠层", "04-sheet-stacking.webp"],
  ["05", "叠层体精密压合", "05-lamination-pressing.webp"],
  ["06", "母块视觉对准与切割", "06-precision-cutting.webp"],
  ["07", "脱脂与陶瓷/电极共烧", "07-debinding-cofiring.webp"],
  ["08", "外电极涂覆与烧结", "08-external-termination.webp"],
  ["09", "Ni 阻挡层与 Sn 镀层", "09-ni-sn-plating.webp"],
  ["10", "电性能测试、分选与包装", "10-testing-packaging.webp"],
] as const;

const packagingImages = [
  ["01", "晶圆视觉对准与精密切割", "01-wafer-dicing-alignment.webp"],
  ["02", "Die Bond 高精度拾取与贴装", "02-die-bond-placement.webp"],
  ["03", "Flip Chip / TCB 精密对准", "03-flip-chip-tcb-alignment.webp"],
  ["04", "Wire Bond 视觉定位与轨迹控制", "04-wire-bond-vision.webp"],
  ["05", "Underfill 精密点胶与填充检测", "05-underfill-dispense-inspection.webp"],
  ["06", "封装翘曲与共面度精密量测", "06-warpage-coplanarity-metrology.webp"],
  ["07", "封装 2D/3D AOI 与精密量测", "07-2d-3d-aoi-metrology.webp"],
  ["08", "X-ray / CT 隐蔽互连检测", "08-xray-ct-inspection.webp"],
  ["09", "Wafer Probe 探针—Pad 精密对准", "09-wafer-probe-alignment.webp"],
  ["10", "终测 Handler 精密接触与分选", "10-final-test-handler.webp"],
] as const;

function galleryMarkdown(
  intro: string,
  basePath: string,
  images: ReadonlyArray<readonly [string, string, string]>,
) {
  const gallery = images
    .map(
      ([number, title, filename]) =>
        `## ${number} ${title}\n\n![${title}](${basePath}/${filename})`,
    )
    .join("\n\n");

  return `${intro}\n\n${gallery}`;
}

export const processAtlasPosts: Post[] = [
  {
    id: "atlas-packaging-test-precision",
    title: "半导体封装与测试精度图谱：从晶圆切割到终测分选",
    slug: "semiconductor-packaging-test-precision-atlas",
    excerpt: "10 张工艺海报串联晶圆切割、Die/Flip Chip/Wire Bond、封装量测、AOI、X-ray、Wafer Probe 与终测 Handler，重点说明精度如何转化为良率。",
    content: galleryMarkdown(
      `这套图谱关注封装与测试设备真正需要守住的精度链：视觉识别只是入口，最终还要把坐标标定、运动重复性、热漂移、接触状态与检测数据连成闭环。\n\n> 图中数值为公开设备规格量级或典型工程目标，并非对任一设备的承诺值。实际验收必须结合封装形式、Pitch、材料、温度、节拍和统计口径。\n\n### 阅读方法\n\n每张图从上到下依次给出核心功能、系统结构、关键指标、工艺流程、典型不良与量产收益。对精度指标，优先关注统计口径（如 3σ）、全场覆盖和热态条件，而不是只看单次最优值。`,
      "/images/process-atlas/packaging-test",
      packagingImages,
    ) + `\n\n## 资料框架\n\n- [DISCO：自动晶圆切割与多种视觉对准方法](https://www-hq.disco.co.jp/eg/products/dicer/dfd6342.html)\n- [Besi：高精度 Die / Flip Chip 贴装设备](https://www.besi.com/products-technology/product-details/product/datacon-8800-fc-quantum-advx/)\n- [ASMPT：高端 Wire Bond 与 AOI](https://semi.asmpt.com/en/products/cis/ball-bonding/)\n- [Onto Innovation：先进封装 2D/3D 检测与量测](https://ontoinnovation.com/products/firefly-g3/)\n- [Nordson：半导体封装 X-ray 检测](https://www.nordson.com/en/Products/Test-and-Inspection-Products/DAGE-XD7800NT-Ruby-XL)\n- [FormFactor：自动 Wafer Probe 对准](https://www.formfactor.com/product/probe-systems/software/velox/)\n- [Advantest：精密视觉终测 Handler](https://www3.advantest.com/documents/11348/146262/pdf_datasheet_M6245_8.5x11.pdf/c05de5c6-93f7-2210-1ece-bb920f24a93f)`,
    cover_image: "/images/process-atlas/packaging-test/cover.webp",
    status: "published",
    reading_time: 12,
    featured: false,
    published_at: "2026-07-17T02:10:00.000+08:00",
    created_at: "2026-07-17T02:10:00.000+08:00",
    category_id: processAtlasCategory.id,
    category: processAtlasCategory,
  },
  {
    id: "atlas-mlcc-process-precision",
    title: "MLCC 精密制造工艺图谱：从浆料到测试包装",
    slug: "mlcc-precision-manufacturing-process-atlas",
    excerpt: "用 10 张技术海报拆解 MLCC 的浆料、流延、内电极印刷、叠层、压合、切割、共烧、端电极、电镀与测试包装。",
    content: galleryMarkdown(
      `MLCC 的容量、一致性与可靠性并不是由某一个“高精度设备”单独决定，而是从粉体分散到最终分选的连续误差预算。前段的膜厚、印刷和叠层偏差，会在压合、切割与烧结收缩后被放大或固化。\n\n> 图中指标为典型工程目标或常见范围。不同介质层厚度、尺寸代码、材料体系和设备配置会对应不同验收窗口。\n\n### 10 个关键工艺点\n\n图谱按照实际制造主线排列，并在每张图中同时呈现系统结构、关键指标、工艺流程和典型不良，便于用于工艺培训、方案讨论和设备能力拆解。`,
      "/images/process-atlas/mlcc",
      mlccImages,
    ) + `\n\n## 资料框架\n\n- [Murata：MLCC 生产流程](https://www.murata.com/en-us/support/faqs/capacitor/ceramiccapacitor/conf/0002)\n- [Murata：陶瓷绿片工艺](https://corporate.murata.com/technology/technology-platform/production-technology/green-sheet-process)`,
    cover_image: "/images/process-atlas/mlcc/cover.webp",
    status: "published",
    reading_time: 11,
    featured: false,
    published_at: "2026-07-17T02:00:00.000+08:00",
    created_at: "2026-07-17T02:00:00.000+08:00",
    category_id: processAtlasCategory.id,
    category: processAtlasCategory,
  },
];

const processAtlasPostIds = new Set(processAtlasPosts.map((post) => post.id));

export function isProcessAtlasPostId(id: string) {
  return processAtlasPostIds.has(id);
}
