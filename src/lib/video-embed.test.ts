import { describe, expect, it } from "vitest";
import { videoEmbedUrl } from "./video-embed";

const ID = "dQw4w9WgXcQ";
const YT = `https://www.youtube-nocookie.com/embed/${ID}`;

describe("videoEmbedUrl allowed", () => {
  it("youtube watch", () => expect(videoEmbedUrl(`https://www.youtube.com/watch?v=${ID}`)).toBe(YT));
  it("youtube without www", () => expect(videoEmbedUrl(`https://youtube.com/watch?v=${ID}`)).toBe(YT));
  it("youtu.be", () => expect(videoEmbedUrl(`https://youtu.be/${ID}`)).toBe(YT));
  it("embed", () => expect(videoEmbedUrl(`https://www.youtube.com/embed/${ID}`)).toBe(YT));
  it("shorts", () => expect(videoEmbedUrl(`https://youtube.com/shorts/${ID}`)).toBe(YT));
  it("vimeo", () => expect(videoEmbedUrl("https://vimeo.com/123456789")).toBe("https://player.vimeo.com/video/123456789"));
});

describe("videoEmbedUrl rejected", () => {
  it("empty", () => expect(videoEmbedUrl(null)).toBeNull());
  it("http", () => expect(videoEmbedUrl(`http://www.youtube.com/watch?v=${ID}`)).toBeNull());
  it("other domain", () => expect(videoEmbedUrl(`https://evil.com/watch?v=${ID}`)).toBeNull());
  it("lookalike domain", () => expect(videoEmbedUrl(`https://youtube.com.evil.com/watch?v=${ID}`)).toBeNull());
  it("javascript:", () => expect(videoEmbedUrl("javascript:alert(1)")).toBeNull());
  it("vimeo non-numeric", () => expect(videoEmbedUrl("https://vimeo.com/channels/x")).toBeNull());
});
