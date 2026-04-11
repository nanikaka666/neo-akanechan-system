import axios from "axios";
import { ChannelResponse, YoutubeApiClient } from "../../../src/main/youtubeApi/client";
import { ChannelId } from "../../../src/types/youtubeDomainModel";

afterEach(() => {
  vi.clearAllMocks();
});

test("Check correctness which how to call the api", async () => {
  vi.spyOn(axios, "get").mockResolvedValue({
    status: 200,
    data: {
      items: [
        {
          id: "ChannelId000000000000001",
          snippet: {
            title: "title",
            description: "description",
            customUrl: "@customUrl",
            publishedAt: 0,
            thumbnails: {
              default: {
                url: "https://example.com/thumbnail/default",
                width: 200,
                height: 200,
              },
              medium: {
                url: "https://example.com/thumbnail/medium",
                width: 200,
                height: 200,
              },
              high: {
                url: "https://example.com/thumbnail/high",
                width: 200,
                height: 200,
              },
            },
          },
          statistics: {
            subscriberCount: 100,
          },
          brandingSettings: {
            image: {
              bannerExternalUrl: "https://example.com/banner",
            },
          },
        },
      ],
    },
  });

  await YoutubeApiClient.getChannelOfMine("accessToken");

  const [url, config] = vi.mocked(axios.get).mock.calls[0];

  expect(url).toBe("https://www.googleapis.com/youtube/v3/channels");
  expect(config?.headers?.Authorization).toBe(`Bearer accessToken`);
  expect(config?.params.mine).toBe(true);
  (config?.params.part as string).split(",").forEach((partParams) => {
    expect(partParams).toBeOneOf(["id", "snippet", "statistics", "brandingSettings"]);
  });
  expect(axios.get).toHaveBeenCalledTimes(1);
});

test("throw an exception when status code is not 200", async () => {
  vi.spyOn(axios, "get").mockResolvedValue({
    status: 400,
  });

  await expect(() => YoutubeApiClient.getChannelOfMine("accessToken")).rejects.toThrow(Error);
});

test("returns undefined when `items` property is missing in response", async () => {
  vi.spyOn(axios, "get").mockResolvedValue({
    status: 200,
    data: {},
  });

  expect(await YoutubeApiClient.getChannelOfMine("accessToken")).toBe(undefined);
});

describe("Check correctness about return value", () => {
  test("the channel has banner image", async () => {
    vi.spyOn(axios, "get").mockResolvedValue({
      status: 200,
      data: {
        items: [
          {
            id: "ChannelId000000000000001",
            snippet: {
              title: "title",
              description: "description",
              customUrl: "@customUrl",
              publishedAt: 0,
              thumbnails: {
                default: {
                  url: "https://example.com/thumbnail/default",
                  width: 200,
                  height: 200,
                },
                medium: {
                  url: "https://example.com/thumbnail/medium",
                  width: 200,
                  height: 200,
                },
                high: {
                  url: "https://example.com/thumbnail/high",
                  width: 200,
                  height: 200,
                },
              },
            },
            statistics: {
              subscriberCount: 100,
            },
            brandingSettings: {
              image: {
                bannerExternalUrl: "https://example.com/banner",
              },
            },
          },
        ],
      },
    });

    expect(await YoutubeApiClient.getChannelOfMine("accessToken")).toEqual({
      id: new ChannelId("ChannelId000000000000001"),
      snippet: {
        title: "title",
        description: "description",
        customUrl: "@customUrl",
        publishedAt: new Date(0),
        thumbnails: {
          default: {
            url: "https://example.com/thumbnail/default",
            width: 200,
            height: 200,
          },
          medium: {
            url: "https://example.com/thumbnail/medium",
            width: 200,
            height: 200,
          },
          high: {
            url: "https://example.com/thumbnail/high",
            width: 200,
            height: 200,
          },
        },
      },
      statistics: {
        subscriberCount: 100,
      },
      brandingSettings: {
        image: {
          bannerExternalUrl: "https://example.com/banner",
        },
      },
    } satisfies ChannelResponse);
  });

  test("the channel has no banner image", async () => {
    vi.spyOn(axios, "get").mockResolvedValue({
      status: 200,
      data: {
        items: [
          {
            id: "ChannelId000000000000001",
            snippet: {
              title: "title",
              description: "description",
              customUrl: "@customUrl",
              publishedAt: 0,
              thumbnails: {
                default: {
                  url: "https://example.com/thumbnail/default",
                  width: 200,
                  height: 200,
                },
                medium: {
                  url: "https://example.com/thumbnail/medium",
                  width: 200,
                  height: 200,
                },
                high: {
                  url: "https://example.com/thumbnail/high",
                  width: 200,
                  height: 200,
                },
              },
            },
            statistics: {
              subscriberCount: 100,
            },
            brandingSettings: {},
          },
        ],
      },
    });

    expect(await YoutubeApiClient.getChannelOfMine("accessToken")).toEqual({
      id: new ChannelId("ChannelId000000000000001"),
      snippet: {
        title: "title",
        description: "description",
        customUrl: "@customUrl",
        publishedAt: new Date(0),
        thumbnails: {
          default: {
            url: "https://example.com/thumbnail/default",
            width: 200,
            height: 200,
          },
          medium: {
            url: "https://example.com/thumbnail/medium",
            width: 200,
            height: 200,
          },
          high: {
            url: "https://example.com/thumbnail/high",
            width: 200,
            height: 200,
          },
        },
      },
      statistics: {
        subscriberCount: 100,
      },
      brandingSettings: {},
    } satisfies ChannelResponse);
  });
});
