import notesRoutes from "pages/api/notes";
import {
  respondOk,
  respondServerError,
  respondUnprocessableEntity,
  respondCreated
} from "helpers/Responses";

import Note from "models/Note";

jest.mock("../../../../helpers/Responses");
jest.mock("../../../../models/Note");

const mockAll = jest.fn();
const mockCreate = jest.fn();

Note.all = mockAll;
Note.create = mockCreate;

const title = "the title";
const body = "the body";

const res = {};

describe("notesRoutes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when req.method is GET", () => {
    describe("when the notes exist", () => {
      it("calls respondOk", async () => {
        const req = { method: "GET" };

        const notes = ["lots", "of", "notes"];

        mockAll.mockReturnValue(notes);

        // @ts-ignore
        await notesRoutes(req, res);

        expect(mockAll).toHaveBeenCalled();
        expect(respondOk).toHaveBeenCalledWith(res, notes);
      });
    });
  });

  describe("when req.method is POST", () => {
    describe("when the creation is successful", () => {
      it("calls respondCreated", async () => {
        const req = {
          method: "POST",
          body: { title, body }
        };

        const note = { title, body };

        mockCreate.mockReturnValue(note);

        // @ts-ignore
        await notesRoutes(req, res);

        expect(mockCreate).toHaveBeenCalledWith({ title, body });
        expect(respondCreated).toHaveBeenCalledWith(res, note);
      });
    });
  });

  describe("when there is an error", () => {
    const req = {
      method: "POST",
      body: { title, body }
    };

    const err = new Error("boooh");
    it("calls respondServerError when it is an unknown error", async () => {
      mockCreate.mockImplementation(() => {
        throw err;
      });

      // @ts-ignore
      await notesRoutes(req, res);
      expect(respondServerError).toHaveBeenCalledWith(res, err);
    });

    it("calls respondUnprocessableEntity when it is an InvalidInputError error", async () => {
      err.name = "InvalidInputError";
      err.message = "oh no you didn't!";

      mockCreate.mockImplementation(() => {
        throw err;
      });

      // @ts-ignore
      await notesRoutes(req, res);
      expect(respondUnprocessableEntity).toHaveBeenCalledWith(res, err.message);
    });
  });

  describe("when req.method is not handled", () => {
    it("returns 405", async () => {
      const method = "PATCH";
      const req = { method };

      const mockEnd = jest.fn();
      const mockStatus = jest.fn().mockImplementation(() => ({ end: mockEnd }));

      const resp = {
        setHeader: jest.fn(),
        status: mockStatus
      };

      // @ts-ignore
      await notesRoutes(req, resp);

      expect(resp.setHeader).toHaveBeenCalledWith("Allow", ["GET", "POST"]);

      expect(mockStatus).toHaveBeenCalledWith(405);
      expect(mockEnd).toHaveBeenCalledWith(`Method ${method} Not Allowed`);
    });
  });
});
