declare module "plotly.js-dist-min" {
  interface PlotMouseEvent {
    points: Array<{ pointIndex: number; x: number; y: number; data: unknown }>;
  }

  type PlotType = "scatter3d" | "scatter" | "bar";
  type PlotMode = "markers" | "text" | "markers+text" | "lines";
  type TextPosition = "top center" | "bottom center" | "middle center";
  type HoverInfo = "text" | "x" | "y" | "z" | "all" | "none";

  interface MarkerConfig {
    size?: number | number[];
    color?: string | string[];
    opacity?: number;
  }

  interface TraceData {
    x?: number[];
    y?: number[];
    z?: number[];
    text?: string[];
    mode?: PlotMode;
    type?: PlotType;
    marker?: MarkerConfig;
    textposition?: TextPosition;
    hoverinfo?: HoverInfo;
  }

  interface AxisLayout {
    color?: string;
  }

  interface SceneLayout {
    bgcolor?: string;
    xaxis?: AxisLayout;
    yaxis?: AxisLayout;
    zaxis?: AxisLayout;
  }

  interface TitleConfig {
    text?: string;
    font?: { color?: string; size?: number };
  }

  interface Layout {
    title?: TitleConfig | string;
    margin?: { l?: number; r?: number; b?: number; t?: number };
    paper_bgcolor?: string;
    plot_bgcolor?: string;
    scene?: SceneLayout;
    font?: { color?: string; size?: number };
    legend?: { orientation?: "h" | "v" };
  }

  interface Config {
    responsive?: boolean;
    displayModeBar?: boolean;
  }

  type PlotlyHTMLElement = HTMLDivElement & {
    on(event: "plotly_click", cb: (data: PlotMouseEvent) => void): void;
    removeAllListeners(event: string): void;
  };

  function react(
    root: HTMLElement,
    data: TraceData[],
    layout?: Partial<Layout>,
    config?: Partial<Config>
  ): Promise<PlotlyHTMLElement>;

  function newPlot(
    root: HTMLElement,
    data: TraceData[],
    layout?: Partial<Layout>,
    config?: Partial<Config>
  ): Promise<PlotlyHTMLElement>;

  export { PlotMouseEvent, TraceData, Layout, Config, PlotlyHTMLElement, react, newPlot };
  export default { react, newPlot };
}
