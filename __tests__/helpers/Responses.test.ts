import {
  respondNotFound,
  respondServerError,
  respondUnprocessableEntity,
  respondOk,
  respondCreated
} from "helpers/Responses";
import Response from "helpers/Response";
import logger from "utils/logger";

jest.mock("../../utils/logger");

const MESSAGE = "custom";

describe("Responses", () => {
  const mockJson = jest.fn();
  const mockStatus = jest.fn().mockImplementation(() => ({ json: mockJson }));

  const resp = { status: mockStatus };

  const body = { status: "good" };

  describe("respondNotFound", () => {
    it("sets the response status to 404", () => {
      // @ts-ignore
      respondNotFound(resp);
      expect(mockStatus).toHaveBeenCalledWith(404);
    });

    it("calls `json` with the default message when none is provided", () => {
      // @ts-ignore
      respondNotFound(resp);
      expect(mockJson).toHaveBeenCalledWith(
        Response.fail({ message: "not found" })
      );
    });

    it("calls `json` with the custom message provided", () => {
      // @ts-ignore
      respondNotFound(resp, MESSAGE);
      expect(mockJson).toHaveBeenCalledWith(
        Response.fail({ message: MESSAGE })
      );
    });
  });

  describe("respondServerError", () => {
    const err = new Error(MESSAGE);
    it("sets the response status to 500", () => {
      // @ts-ignore
      respondServerError(resp, err);
      expect(mockStatus).toHaveBeenCalledWith(500);
    });

    describe("when the error is an Error object", () => {
      it("calls `json` with error.message", () => {
        // @ts-ignore
        respondServerError(resp, err);
        expect(mockJson).toHaveBeenCalledWith(
          Response.fail({ message: MESSAGE })
        );
      });

      it("logs the error", () => {
        // @ts-ignore
        respondServerError(resp, err);
        expect(logger.error).toHaveBeenCalledWith(err);
      });
    });

    describe("when the error is a string", () => {
      const errString = MESSAGE;
      it("calls `json` with the string", () => {
        // @ts-ignore
        respondServerError(resp, errString);
        expect(mockJson).toHaveBeenCalledWith(
          Response.fail({ message: MESSAGE })
        );
      });

      it("logs the error", () => {
        // @ts-ignore
        respondServerError(resp, errString);
        expect(logger.error).toHaveBeenCalledWith(errString);
      });
    });
  });

  describe("respondUnprocessableEntity", () => {
    it("sets the response status to 422", () => {
      // @ts-ignore
      respondUnprocessableEntity(resp);
      expect(mockStatus).toHaveBeenCalledWith(422);
    });

    it("calls `json` with the default message when none is provided", () => {
      // @ts-ignore
      respondUnprocessableEntity(resp);
      expect(mockJson).toHaveBeenCalledWith(
        Response.fail({ message: "unprocessable entity" })
      );
    });

    it("calls `json` with the custom message provided", () => {
      // @ts-ignore
      respondUnprocessableEntity(resp, MESSAGE);
      expect(mockJson).toHaveBeenCalledWith(
        Response.fail({ message: MESSAGE })
      );
    });
  });

  describe("respondOk", () => {
    it("sets the response status to 200", () => {
      // @ts-ignore
      respondOk(resp, body);
      expect(mockStatus).toHaveBeenCalledWith(200);
    });
    it("calls `json` with the responseBody provided", () => {
      // @ts-ignore
      respondOk(resp, body);
      expect(mockJson).toHaveBeenCalledWith(Response.ok(body));
    });
  });

  describe("respondCreated", () => {
    it("sets the response status to 201", () => {
      // @ts-ignore
      respondCreated(resp, body);
      expect(mockStatus).toHaveBeenCalledWith(201);
    });
    it("calls `json` with the responseBody provided", () => {
      // @ts-ignore
      respondCreated(resp, body);
      expect(mockJson).toHaveBeenCalledWith(Response.ok(body));
    });
  });
});
