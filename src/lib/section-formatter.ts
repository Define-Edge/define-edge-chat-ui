import { Section } from "@/types/stock-analysis";

export class SectionFormatter {
    private section: Section;

    constructor(section: Section) {
        this.section = section;
    }

    getAnchorId() {
        const normalized = String(this.section.title ?? "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        return normalized || "section";
    }

    getSource(): string {
        const sources = this.section.sources;
        if (!sources) {
            return "";
        }
        if (typeof sources === "string") {
            return sources;
        }
        const domainPattern = /https?:\/\/(?:www\.)?([^/]+)/;
        const _sources = sources
            .map((source) => {
                const match = source.match(domainPattern);
                const domain = match ? match[1] : source;
                return `[${domain}](${source}) ,`;
            })
            .join("\n");
        return _sources;
    }

    formatSources(): string {
        const sources = this.section.sources;
        if (!sources) {
            return "";
        }
        if (typeof sources === "string") {
            return `<details open><summary>Sources</summary>\n\n${sources}\n</details>\n`;
        }

        const domainPattern = /https?:\/\/(?:www\.)?([^/]+)/;
        const _sources = sources
            .map((source) => {
                const match = source.match(domainPattern);
                const domain = match ? match[1] : source;
                return `[${domain}](${source}) ,`;
            })
            .join("\n");

        if (sources.length > 0) {
            return `<details open><summary>Sources</summary>\n\n${_sources}\n</details>\n`;
        } else {
            return "";
        }
    }

    getTitleMarkdown() {
        return `## ${this.section.title}\n`;
    }

    getContentMarkdown() {
        return `${this.section.content}\n`;
    }

    getInDepthAnalysisMarkdown() {
        if (this.section.in_depth_analysis) {
            return `<details open><summary>In-depth Analysis</summary>\n\n${this.section.in_depth_analysis}\n</details>\n`;
        }
        return "";
    }

    getSourcesMarkdown() {
        return this.formatSources();
    }

    getMarkdown() {
        return `${this.getTitleMarkdown()}${this.getContentMarkdown()}${this.getInDepthAnalysisMarkdown()}${this.getSourcesMarkdown()}\n---\n`;
    }
}
