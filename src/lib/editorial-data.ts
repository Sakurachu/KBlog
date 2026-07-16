import type { Category, Post } from "@/lib/types";

export const editorialCategories: Category[] = [
  {
    id: "editorial-alignment-basics",
    name: "对准基础",
    slug: "alignment-basics",
    description: "读懂精度、重复性、Overlay 与误差预算，先把指标说清楚。",
    accent: "coral",
  },
  {
    id: "editorial-advanced-packaging",
    name: "先进封装",
    slug: "advanced-packaging",
    description: "从 Die Bond、Flip Chip 到晶圆键合，拆解对准与贴合链路。",
    accent: "teal",
  },
  {
    id: "editorial-display-manufacturing",
    name: "显示制造",
    slug: "display-manufacturing",
    description: "聚焦 OLED 掩膜与 Mini/Micro LED 巨量转移的视觉对准。",
    accent: "yellow",
  },
];

const [alignmentBasics, advancedPackaging, displayManufacturing] = editorialCategories;

export const editorialPosts: Post[] = [
  {
    id: "editorial-precision-alignment-map",
    title: "从 ±10 μm 到纳米级：精密制造对准能力地图怎么读",
    slug: "precision-alignment-capability-map",
    excerpt:
      "同样叫“对准”，Die Bond、晶圆 Overlay、OLED 掩膜和 Micro LED 转移衡量的并不是同一件事。先统一对象、坐标系与统计口径，再谈设备方案。",
    content: `## 一张地图，为什么不能只看“精度”一列

精密制造里的“对准”至少包含四个不同问题：**看见目标、求出相对位姿、把机构移动到位、让工艺完成后仍然留在位**。任何一环都可能成为最终偏差的主导项。

因此，需求表里只写“精度 ±3 μm”是不够的。它没有说明这是识别误差、平台定位误差、贴装后的 3σ 偏差，还是整片基板上的最大 Overlay。把这些指标混在一起，设备选型很容易从第一步就走偏。

## 半导体与显示制造中的典型目标

下表把能力地图里最常见的任务放到同一张坐标系中。数值是**方案讨论阶段的典型目标区间**，不是跨设备、跨工艺通用的验收标准。

| 工艺场景 | 主要对准对象 | 常见目标量级 | 真正需要验收的结果 |
| --- | --- | ---: | --- |
| Die Bond | 芯片与载板 / Submount | ±1–5 μm | Bond 后芯片中心与角度偏差 |
| Flip Chip | Bump 阵列与 Pad 阵列 | ±2–5 μm | 回流或热压后互连重叠量 |
| 晶圆键合 | Wafer 与 Wafer | 亚微米至纳米级 | Bond 后 Overlay 分布 |
| 光刻 Overlay | 当前层与前层图形 | 纳米级 | 全晶圆多点 Overlay 模型 |
| OLED 蒸镀 | 金属掩膜与 TFT 基板 | ±2–5 μm | 像素开口与沉积图形偏差 |
| Mini/Micro LED 转移 | Donor 芯片阵列与 Backplane | ±1–5 μm | 转移后位置、角度、良率与缺陷分布 |

高端设备的能力可以明显优于表中的宽泛区间。例如 ASMPT AMICRA NANO 公布的放置精度达到 ±0.2 μm（3σ）；EV Group 的 SmartView NT3 公布了小于 50 nm 的晶圆对晶圆对准能力；ASML 则把先进光刻 Overlay 控制推进到 2 nm 以下。这些数字说明的是**特定设备、特定条件和特定统计定义下的能力**，不能直接互换。

## 先把四个指标拆开

### 1. 分辨率 Resolution

分辨率描述系统能分辨多小的位移或图像细节。编码器分辨率 10 nm，不等于平台能以 10 nm 的绝对精度到达目标；相机像素映射 0.5 μm/px，也不等于识别只能做到 0.5 μm。

### 2. 重复性 Repeatability

重复性回答“同样的动作做很多次，会散布多大”。它通常要说明单向还是双向、1σ 还是 3σ、样本量、行程位置、负载与温度。

### 3. 准确度 Accuracy

准确度描述测量值或最终位置与真值之间的偏差。它会受到标定、畸变、Abbe 误差、平台正交度、焦面变化和工艺漂移影响。

### 4. Overlay

Overlay 是两个图形层或两个对象在实际工艺结果上的相对套准误差。它不只是一个 XY 平移量，还可能包含旋转、倍率、非正交、晶圆形变和局部高阶残差。

> 设备能“走到哪里”只是运动指标；产品最终“落在哪里”才是工艺指标。

## 一套可执行的需求写法

把“需要 ±3 μm 对准”改写成下面这样的验收句，方案会清晰很多：

- 对象：8 mm 芯片对 100 mm 载板，识别芯片边缘与载板双 Mark。
- 视场：覆盖 100 mm × 100 mm，四角与中心五点建模。
- 结果：贴装后 XY 偏差 ≤ ±3 μm（3σ），角度偏差 ≤ ±0.02°。
- 条件：25 ±1°C，连续运行 8 小时，指定胶厚、压力与固化曲线。
- 测量：由独立上视计量相机复测，报告均值、3σ、最大值和位置分布。

这样写以后，视觉、平台、热设计、工艺夹具和计量方法才有共同的目标。

## 选型前必须回答的六个问题

1. 对准的是 Mark、边缘、Bump、像素，还是功能图形？
2. 最终关心的是对准前、接触瞬间，还是固化 / 回流 / 键合后的偏差？
3. 指标是单点、全视场、全晶圆，还是跨批次？
4. 允许用几何模型补偿到几阶：刚体、仿射，还是高阶 Map？
5. 温度、真空、压力和材料形变是否进入误差预算？
6. 谁来提供独立真值，如何避免“同一套视觉自证精度”？

下一篇我们进入最常见的封装场景，拆解 Die Bond 与 Flip Chip 的完整对准链路。

## 参考资料

- [ASML：Measuring accuracy](https://www.asml.com/en/technology/lithography-principles/measuring-accuracy)
- [ASML：Aligning lithography to the nanometer](https://www.asml.com/en/news/stories/2021/fellow-simon-mathijssen-aligning-lithography-nanometer)
- [EV Group：SmartView NT3 wafer bond alignment](https://www.evgroup.com/company/news/detail/ev-group-accelerates-3d-ic-packaging-roadmap-with-breakthrough-wafer-bonding-technology-1549022748)
- [ASMPT AMICRA：NANO Die / Flip Chip Bonder](https://amicra.semi.asmpt.com/en/products/die-flip-chip-bonder/nano-die-bonder-and-flip-chip-bonder/)
`,
    cover_image: "/images/alignment-map.webp",
    status: "published",
    reading_time: 9,
    featured: true,
    published_at: "2026-07-16T09:30:00.000+08:00",
    created_at: "2026-07-16T09:30:00.000+08:00",
    category_id: alignmentBasics.id,
    category: alignmentBasics,
  },
  {
    id: "editorial-die-bond-flip-chip",
    title: "Die Bond 与 Flip Chip：±1–5 μm 对准是怎样做出来的",
    slug: "die-bond-flip-chip-precision-alignment",
    excerpt:
      "从上下视野识别、坐标变换、XYθ 补偿到 Bond 后复检，逐段拆解高精度贴装的误差来源与验收方法。",
    content: `## 贴装不是一次“拍照后移动”

Die Bond 与 Flip Chip 的核心任务，是把芯片坐标系稳定地映射到载板坐标系。典型系统会把动作拆成拾取、芯片识别、基板识别、位姿计算、贴放 / 热压和 Bond 后检测，而不是依赖一次相机测量完成全部工作。

对于普通 Die Attach，芯片外形、金属区或专用 Mark 都可能是定位特征；对于 Flip Chip，真正决定互连窗口的是 Bump 阵列与 Pad 阵列。两者都写“±3 μm”时，识别对象和失效机理可能完全不同。

## 一条完整的对准链路

1. **拾取与预定位**：从蓝膜或晶圆环上取芯，先控制吸嘴偏心与芯片姿态。
2. **芯片侧识别**：上视相机或翻转光学读取芯片边缘、Mark 或 Bump，求出芯片中心和 θ。
3. **基板侧识别**：下视相机读取载板 Mark、Pad 或局部图形，建立载板坐标。
4. **坐标变换**：用标定结果把两个相机坐标统一到运动平台坐标，并加入工具中心点补偿。
5. **XYθ 补偿**：平台或 Bond Head 完成平移与旋转修正。
6. **接触与工艺**：施加压力、温度、超声或激光能量；此时材料和机构会继续移动。
7. **Post-bond Inspection**：独立复测最终落点，并把系统性偏差反馈给后续循环。

## 误差预算：最容易漏掉的是工艺后的移动

可以先用均方根形式估算互不相关的随机误差：

**σ_total ≈ √(σ_vision² + σ_stage² + σ_calibration² + σ_process² + σ_metrology²)**

但热漂移、胶层流动、吸嘴偏心和标定残差往往带有方向性，不能全部当作随机噪声“开平方”消掉。

| 误差项 | 常见表现 | 优先处理方式 |
| --- | --- | --- |
| 芯片 / 基板识别 | Mark 对比度变化、边缘崩缺导致偏心 | 多特征拟合、置信度门限、照明配方 |
| 双相机标定 | 视野切换后出现固定偏差 | 同一计量板闭环标定与周期复核 |
| 平台与旋转中心 | 不同 θ 角产生不同 XY 偏移 | 标定真实旋转中心，补偿 Abbe 臂长 |
| 吸嘴与取放 | 芯片在吸嘴上滑移或翘曲 | 真空监测、共面度控制、工具追溯 |
| 胶 / 焊料 / 热压 | 接触后漂移，回流自对准或偏移 | 受控下降、温压曲线、Bond 后测量 |
| 温度漂移 | 连续生产后均值缓慢迁移 | 热稳态设计、温度模型、Golden Sample |

## 为什么高端设备会用动态对准

如果芯片在“识别之后、贴装之前”经历长距离搬运，静态标定误差和热漂移会被直接带到最终落点。动态对准把关键视觉和放置工位布置得更接近，并在运动过程中更新偏差；配合固定在高稳定结构上的光学系统、减振基座和自动 Offset Tuning，可以显著压低系统性误差。

ASMPT AMICRA 的公开资料展示了从 ±1.5 μm（3σ）到 ±0.2 μm（3σ）的不同平台能力，也明确列出了动态对准、自动放置偏移调节、减振和 Bond 后检测。这说明亚微米能力不是单一“高像素相机”的结果，而是整机误差链共同收敛。

## 验收时至少看四张图

- **XY 散点图**：观察均值偏移、离群点和方向性。
- **位置热力图**：判断大行程标定、基板翘曲或温度场问题。
- **时间序列**：分辨预热漂移、换批跳变和长期趋势。
- **θ 与 XY 相关图**：检查旋转中心和工具偏心补偿。

只有一个“3σ 数字”无法说明设备是否适合量产。建议同时报告平均值、3σ、最大值、Cpk、测量不确定度以及测试条件，并把最终功能窗口映射到 Bump / Pad 的实际重叠余量。

## 参考资料

- [ASMPT AMICRA：NANO Die / Flip Chip Bonder](https://amicra.semi.asmpt.com/en/products/die-flip-chip-bonder/nano-die-bonder-and-flip-chip-bonder/)
- [ASMPT：Co-Packaged Optics precision bonding](https://www.asmpt.com/en/innovation/co-packaged-optics/)
- [ASMPT AMICRA：3D IC, TSV and TCB process](https://amicra.semi.asmpt.com/en/applications/3d-ic-tsv-and-tcb/)
`,
    cover_image: "/images/die-bond-alignment.webp",
    status: "published",
    reading_time: 8,
    featured: false,
    published_at: "2026-07-16T09:20:00.000+08:00",
    created_at: "2026-07-16T09:20:00.000+08:00",
    category_id: advancedPackaging.id,
    category: advancedPackaging,
  },
  {
    id: "editorial-overlay-boundary",
    title: "Overlay 不是“更准的相机对准”：纳米级套刻的系统边界",
    slug: "wafer-overlay-not-camera-alignment",
    excerpt:
      "当指标从微米进入 10–50 nm，问题会从刚体 XYθ 定位升级为整片晶圆的形变建模、计量采样与过程控制。",
    content: `## 从“对到一个点”变成“控制一张误差场”

微米级装配通常可以先把两个对象近似为刚体，用 X、Y、θ 三个自由度描述相对位置。晶圆多层图形的 Overlay 则不同：晶圆会经历旋涂、烘烤、曝光、刻蚀、沉积和应力变化，误差不只来自平移与旋转，还包含倍率、非正交、晶圆形变和局部残差。

因此，10–50 nm 级的 Overlay 任务不能简单理解成“换一台更高倍率相机”。它需要曝光设备、对准传感器、计量目标、全晶圆采样、模型拟合与反馈控制共同工作。

## Alignment 与 Overlay 的区别

| 概念 | 回答的问题 | 常见输出 |
| --- | --- | --- |
| Wafer Alignment | 曝光前，晶圆相对设备坐标在哪里？ | 位置、旋转、晶圆网格模型 |
| Overlay | 曝光并显影后，本层图形相对前层落在哪里？ | 多点 X/Y 偏差与统计分布 |
| Placement Accuracy | 机构把对象放到目标位的能力如何？ | 单次或重复放置偏差 |
| Metrology Uncertainty | 测量结果本身有多可信？ | 重复性、再现性、不确定度 |

ASML 将 Overlay 定义为芯片层与层之间的对准准确度，并通过专用计量目标获取数据，再把结果反馈给光刻系统。公开资料显示，先进光刻平台的 Overlay 能力已优于 2 nm；这与普通工业视觉的微米级“找 Mark”属于不同系统层级。

## 为什么要多点测量

只在晶圆中心测一个 Mark，最多能说明局部位置。要区分下列误差，必须在全晶圆布置计量点：

- 全局 X/Y 平移与旋转；
- X/Y 倍率差与非正交；
- 扫描方向相关误差；
- 晶圆边缘高阶形变；
- 场内 Overlay 与局部工艺残差。

采样点越多，能识别的模型越复杂，但测量时间、数据量和过拟合风险也会上升。正确做法不是无限加点，而是让采样策略对应可执行的补偿自由度。

## 晶圆键合又是另一种 Overlay

混合键合或晶圆堆叠需要在两片晶圆接触前完成面对面对准，同时控制颗粒、平坦度、弯曲与键合波传播。EV Group 公布的 SmartView NT3 对准能力小于 50 nm，并报告了小于 100 nm 的键合后 Overlay 演示结果。

这里尤其要区分：

- **对准机台读数**：接触前视觉求得的相对位姿；
- **键合后 Overlay**：接触、夹持和键合过程完成后的真实结果；
- **局部互连叠加量**：微凸点或混合键合 Pad 在局部位置的重叠余量。

## 什么时候普通视觉方案仍然适用

如果任务是晶圆搬运预对准、切割道定位、Probe Card 对针、背面粗对准或先进封装中的大尺寸 Mark 识别，工业视觉加高精度平台仍然非常有效。真正的边界不只由“纳米”两个字决定，而是由以下条件决定：

1. 是否需要测量已经形成的图形层，而非机械载台位置；
2. 是否需要覆盖全晶圆高阶形变；
3. 测量不确定度是否必须显著小于工艺公差；
4. 是否能把测量结果反馈到真实可控的曝光或键合自由度。

若四项都成立，需求已经进入专用 Overlay 计量与过程控制系统，而不是单机视觉定位项目。

## 参考资料

- [ASML：Measuring accuracy](https://www.asml.com/en/technology/lithography-principles/measuring-accuracy)
- [ASML：Overachieving with overlay control](https://www.asml.com/en/news/stories/2023/novel-lens-manipulator)
- [ASML：Aligning lithography to the nanometer](https://www.asml.com/en/news/stories/2021/fellow-simon-mathijssen-aligning-lithography-nanometer)
- [EV Group：SmartView NT3](https://www.evgroup.com/company/news/detail/ev-group-accelerates-3d-ic-packaging-roadmap-with-breakthrough-wafer-bonding-technology-1549022748)
`,
    cover_image: "/images/wafer-overlay.webp",
    status: "published",
    reading_time: 8,
    featured: false,
    published_at: "2026-07-16T09:10:00.000+08:00",
    created_at: "2026-07-16T09:10:00.000+08:00",
    category_id: advancedPackaging.id,
    category: advancedPackaging,
  },
  {
    id: "editorial-oled-mask-alignment",
    title: "OLED 蒸镀掩膜对准：±3 μm 背后的真空、形变与多点补偿",
    slug: "oled-mask-alignment-vacuum-distortion",
    excerpt:
      "金属掩膜与 TFT 基板不仅要在真空腔体内对准，还要面对大尺寸基板、Mask 下垂、热膨胀和像素级累积误差。",
    content: `## OLED 为什么必须在蒸镀时完成图形对准

OLED 有机材料沉积后不适合再用常规刻蚀方式完成 RGB 像素图形，因此量产蒸镀会让材料通过精细金属掩膜（FMM）开口落到 TFT 基板的指定位置。掩膜和基板的相对位置，直接决定发光材料是否落在正确的子像素区域。

Canon Tokki 对其量产系统的说明显示：相机读取金属掩膜与玻璃基板的位置，再由机构精确控制两者关系；System-ELVESS 公布的典型 Mask Alignment 规格为 ±3 μm。

## 这不是普通平面贴合

OLED 掩膜对准至少有四个额外约束：

- **真空环境**：光学、运动、线缆和润滑方案必须兼容真空。
- **大尺寸薄片**：玻璃基板与金属掩膜都可能产生重力下垂和夹持变形。
- **热环境**：蒸镀源和连续运行带来温升，材料热膨胀会改变像素 Pitch。
- **近接间隙**：掩膜与基板间距影响 Shadow 与沉积位置，但过近又增加刮伤与颗粒风险。

## 从双 Mark 到全局 Map

只用两点可以解算 X、Y、θ，但无法识别掩膜倍率变化、非正交和局部形变。高精度系统通常会采集多个 Mark，建立从掩膜坐标到基板坐标的拟合模型。

| 模型层级 | 可补偿误差 | 不能解决的问题 |
| --- | --- | --- |
| 刚体 XYθ | 平移、旋转 | 倍率、剪切、局部形变 |
| 仿射模型 | XYθ、倍率、非正交 | 高阶下垂与局部波纹 |
| 分区 / Map | 大视场局部残差 | 工艺过程中继续变化的热漂移 |

模型阶数越高，不代表结果一定越好。Mark 数量、分布、识别稳定性和可执行机构的自由度必须与模型匹配，否则只是在软件里拟合出一张无法真正补偿的误差图。

## 误差如何变成显示缺陷

掩膜偏移会造成 RGB 材料偏离设计像素，典型后果包括色偏、亮度不均、串色和边缘 Mura。若误差沿面板位置逐渐增大，应优先检查倍率与热膨胀；若中心正常、边缘异常，要关注掩膜张网、夹持与下垂；若偏差随时间单向漂移，则要把温度场和腔体热稳态纳入分析。

## 建议的六步闭环

1. 腔外建立相机内参、畸变和运动坐标标定。
2. 腔内用稳定参考件校正真空与温度条件下的系统偏差。
3. 多点识别掩膜与基板 Mark，输出置信度和残差图。
4. 先做刚体补偿，再判断是否需要倍率或 Map 补偿。
5. 控制接近、吸附与张紧过程，避免对准后再次变形。
6. 用沉积后计量结果反推模型，不用对准机自身读数替代产品验证。

对 OLED 来说，视觉识别只是入口，真正困难的是让大尺寸薄片在真空、热和近接条件下仍保持同一套几何关系。

## 参考资料

- [Canon Tokki：OLED Mass Production System – System-ELVESS](https://tokki.canon/eng/product/el/mass.html)
- [Canon Tokki：Alignment Technology](https://tokki.canon/eng/organic_el/technology.html)
- [Canon Global：OLED display manufacturing equipment](https://global.canon/en/technology/canon-tech/tech/oled-display/)
`,
    cover_image: "/images/oled-mask-alignment.webp",
    status: "published",
    reading_time: 7,
    featured: false,
    published_at: "2026-07-16T09:00:00.000+08:00",
    created_at: "2026-07-16T09:00:00.000+08:00",
    category_id: displayManufacturing.id,
    category: displayManufacturing,
  },
  {
    id: "editorial-micro-led-transfer",
    title: "Mini/Micro LED 巨量转移：双面视觉如何把 Donor 对到 Backplane",
    slug: "micro-led-mass-transfer-dual-side-alignment",
    excerpt:
      "高精度识别只是起点。巨量转移还要同时控制阵列 Pitch、旋转、热漂移、局部形变和转移后的开路、短路与错位。",
    content: `## 一次对准，面对的是成千上万个芯片

Mini/Micro LED 转移把 Donor 上的芯片阵列搬到 Backplane 的电极阵列。单颗芯片的 XY 偏差很重要，但量产真正关心的是整个视场内的阵列能否同时落入互连窗口，以及转移后有多少颗芯片出现开路、短路或错位。

与单颗 Die Bond 相比，巨量转移把问题从“一个刚体对一个目标”升级为“两个阵列的全局与局部匹配”。

## 双面视觉的典型结构

系统通常设置同轴或近同轴的上下视野：上相机识别 Donor Mark 或芯片阵列，下相机识别 Backplane Mark 或电极阵列。标定后，两组坐标被统一到 XYθ 平台或转移头坐标系。

一条可追溯的流程包括：

1. 同步采集 Donor 与 Backplane 图像；
2. 识别高对比度 Mark，并检查识别置信度；
3. 估计光学畸变、阵列 Pitch 和局部形变；
4. 计算全局 XYθ 与可执行的 Map 补偿；
5. 平台运动并在关键位置复测；
6. 完成接触、释放或激光转移；
7. 对转移结果做位置与电学复检。

## 误差不只发生在“对准之前”

| 阶段 | 主要误差 | 可能后果 |
| --- | --- | --- |
| 图像采集 | 焦面不一致、远心误差、照明不均 | Donor / Backplane 坐标偏差 |
| 坐标匹配 | 畸变、Pitch 差、旋转中心误差 | 阵列边缘累积错位 |
| 平台运动 | 回差、正交度、振动、热漂移 | 全局偏移或重复性变差 |
| 接触 / 释放 | 压力不均、自由落体、胶层滑移 | 对准正确但转移后偏移 |
| 后续互连 | 回流、固化、热膨胀 | 开路、短路、亮度与可靠性异常 |

2024 年一项 20 μm Micro LED 激光转移研究展示了超过 18 万颗芯片的阵列转移，报告接近 99.9% 的转移良率、700 pcs/s 的速度和小于 ±1.2 μm 的转移误差。这个结果也说明：**精度、速度与良率必须同时报告**，单独强调一个数字没有量产意义。

## 三类典型不良如何回溯

### 开路 Open

芯片整体偏离 Pad、接触高度不足、局部缺失或焊接不良都可能形成开路。位置热力图若显示边缘更严重，应检查 Pitch 与 Map；随机散点则更像释放或颗粒问题。

### 短路 Short

芯片跨越相邻电极、旋转过大、焊料铺展或阵列局部压缩都可能造成短路。不能只看芯片中心坐标，还要检查角点和实际导电区域的重叠。

### 错位 Misalignment

整片同向偏移通常来自全局 Offset；随位置线性增加多与倍率或 Pitch 有关；呈旋转扇形分布则应检查 θ 与旋转中心；局部块状异常可能来自基板翘曲、转移头平行度或分区标定。

## 推荐的验收矩阵

- 对准前：Mark 识别重复性、双相机坐标一致性、全视场残差。
- 运动后：XYθ 到位误差、等待时间对漂移的影响、温度相关性。
- 转移后：芯片中心、角度、角点到 Pad 的最小间距。
- 功能后：开路、短路、缺失、亮度异常与位置误差的相关性。
- 长期：换批、换头、清洁、预热和连续运行后的均值变化。

真正稳定的巨量转移系统，不是把一次对准做到最小，而是能持续解释“哪一类误差在什么位置、什么时间、通过哪一个补偿自由度被修正”。

## 参考资料

- [Small：20 μm Micro-LEDs Mass Transfer via Laser-Induced In Situ Nanoparticles Resonance Enhancement](https://pubmed.ncbi.nlm.nih.gov/38332445/)
- [Measurement：Error analysis and compensation for Mini LED mass transfer visual positioning system](https://doi.org/10.1016/j.measurement.2024.114913)
- [Advanced Electronic Materials：Roll-Based Direct Overlay Alignment](https://doi.org/10.1002/aelm.202400236)
`,
    cover_image: "/images/micro-led-transfer.webp",
    status: "published",
    reading_time: 8,
    featured: false,
    published_at: "2026-07-16T08:50:00.000+08:00",
    created_at: "2026-07-16T08:50:00.000+08:00",
    category_id: displayManufacturing.id,
    category: displayManufacturing,
  },
];

const editorialPostIds = new Set(editorialPosts.map((post) => post.id));

export function isEditorialPostId(id: string) {
  return editorialPostIds.has(id);
}
