import { generateDirector } from "./directorGenerator";

describe("directorGenerator", () => {
  it("generates randomly distributed stats", () => {
    const director = generateDirector();

    expect(director.stats).toMatchObject({});
  });
});
