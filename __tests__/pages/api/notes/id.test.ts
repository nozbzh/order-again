import idRoute from "pages/api/notes/[id]";
import {
  respondServerError,
  respondUnprocessableEntity,
  respondNotFound,
  respondOk
} from "helpers/Responses";

import Note from "models/Note";

jest.mock("../../../../helpers/Responses");
jest.mock("../../../../models/Note");

const mockDelete = jest.fn();
const mockUpdate = jest.fn();
const mockFind = jest.fn();

Note.delete = mockDelete;
Note.update = mockUpdate;
Note.find = mockFind;

const title = "the title";
const body = "the body";
const id = "123";

const res = {};

describe("idRoute routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when req.method is GET", () => {
    describe("when the note exists", () => {
      it("calls respondOk", async () => {
        const req = {
          method: "GET",
          query: { id }
        };

        const note = { title, body };

        mockFind.mockReturnValue(note);

        // @ts-ignore
        await idRoute(req, res);

        expect(mockFind).toHaveBeenCalledWith(id);
        expect(respondOk).toHaveBeenCalledWith(res, note);
      });
    });
  });

  describe("when req.method is PATCH", () => {
    describe("when update is successful", () => {
      it("calls respondOk", async () => {
        const newBody = "booh";

        const req = {
          method: "PATCH",
          query: { id },
          body: { body: newBody }
        };

        const note = { title, body: newBody };

        mockUpdate.mockReturnValue(note);

        // @ts-ignore
        await idRoute(req, res);

        expect(mockUpdate).toHaveBeenCalledWith({
          id,
          title: undefined,
          body: newBody
        });
        expect(respondOk).toHaveBeenCalledWith(res, note);
      });
    });
  });

  describe("when req.method is DELETE", () => {
    describe("when deletion is successful", () => {
      it("calls respondOk", async () => {
        const req = {
          method: "DELETE",
          query: { id }
        };

        mockDelete.mockReturnValue(true);

        // @ts-ignore
        await idRoute(req, res);

        expect(mockDelete).toHaveBeenCalledWith(id);
        expect(respondOk).toHaveBeenCalledWith(res, { deleted: true });
      });
    });
  });

  describe("when there is an error", () => {
    const newBody = "booh";

    const req = {
      method: "PATCH",
      query: { id },
      body: { body: newBody }
    };

    const err = new Error("boooh");
    it("calls respondServerError when it is an unknown error", async () => {
      mockUpdate.mockImplementation(() => {
        throw err;
      });

      // @ts-ignore
      await idRoute(req, res);
      expect(respondServerError).toHaveBeenCalledWith(res, err);
    });

    it("calls respondUnprocessableEntity when it is an InvalidInputError error", async () => {
      err.name = "InvalidInputError";
      err.message = "oh no you didn't!";

      mockUpdate.mockImplementation(() => {
        throw err;
      });

      // @ts-ignore
      await idRoute(req, res);
      expect(respondUnprocessableEntity).toHaveBeenCalledWith(res, err.message);
    });

    it("calls respondNotFound when the error is a NotFoundError", async () => {
      err.name = "NotFoundError";
      err.message = "it's just not there";

      mockUpdate.mockImplementation(() => {
        throw err;
      });

      // @ts-ignore
      await idRoute(req, res);
      expect(respondNotFound).toHaveBeenCalledWith(res, err.message);
    });
  });

  describe("when req.method is not handled", () => {
    it("returns 405", async () => {
      const method = "POST";
      const req = { method };

      const mockEnd = jest.fn();
      const mockStatus = jest.fn().mockImplementation(() => ({ end: mockEnd }));

      const resp = {
        setHeader: jest.fn(),
        status: mockStatus
      };

      // @ts-ignore
      await idRoute(req, resp);

      expect(resp.setHeader).toHaveBeenCalledWith("Allow", [
        "GET",
        "PATCH",
        "DELETE"
      ]);

      expect(mockStatus).toHaveBeenCalledWith(405);
      expect(mockEnd).toHaveBeenCalledWith(`Method ${method} Not Allowed`);
    });
  });
});
