import { getCities } from "./getCities";

describe("getCities", () => {
  describe("limit", () => {
    it("returns 10,000 records by default", async () => {
      expect((await getCities()).length).toEqual(10000);
    });

    it("returns the number of records specified when limit is set", async () => {
      expect((await getCities({ limit: 2 })).length).toEqual(2);
    });
  });

  describe("offset", () => {
    it("returns the first record in the list by default", async () => {
      expect((await getCities({ limit: 1 }))[0].name).toEqual("Tokyo");
    });

    it("returns the correctly offset record when specified", async () => {
      expect((await getCities({ offset: 126, limit: 1 }))[0].name).toEqual(
        "Toronto",
      );
    });

    describe("when offset is larger than the data set", () => {
      it("returns an empty array", async () => {
        expect(await getCities({ offset: 100000 })).toEqual([]);
      });
    });
  });

  describe("filter", () => {
    it("searches by city name", async () => {
      expect(
        (await getCities({ searchTerm: "San Francisco" }))[0].name,
      ).toEqual("San Francisco");
    });

    it("searches case insensitive", async () => {
      expect((await getCities({ searchTerm: "london" }))[0].name).toEqual(
        "London",
      );
    });

    it("searches by country name", async () => {
      expect((await getCities({ searchTerm: "Malta" })).length).toEqual(68);
    });

    it("throws an error when searching for 'error'", async () => {
      await expect(getCities({ searchTerm: "error" })).rejects.toThrow(
        "Something terrible just happened!",
      );
    });
  });
});
