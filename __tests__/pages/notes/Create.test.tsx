/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import axios from "axios";
import toast from "react-hot-toast";

import Create from "pages/notes/create";
import { DEFAULT_ERROR_MESSAGE } from "utils/ui";

jest.mock("react-hot-toast");
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

afterEach(() => {
  jest.clearAllMocks();
});

describe("Create page", () => {
  const title = "new note";
  const body = "with a new body";
  describe("when submit is successful", () => {
    it("calls axios with the expected arguments", async () => {
      render(<Create />);

      user.type(screen.getByTestId("title-field"), title);
      user.type(screen.getByTestId("body-field"), body);

      user.click(screen.getByText("Submit"));

      await waitFor(() =>
        expect(mockedAxios.post).toHaveBeenCalledWith("/api/notes", {
          title,
          body
        })
      );
    });

    it("calls toast with the expected message", async () => {
      render(<Create />);

      user.type(screen.getByTestId("title-field"), title);
      user.type(screen.getByTestId("body-field"), body);

      user.click(screen.getByText("Submit"));

      await waitFor(() =>
        expect(toast.success).toHaveBeenCalledWith("Created!")
      );
    });
  });

  describe("when submit fails", () => {
    it("calls toast with the expected message", async () => {
      mockedAxios.post.mockImplementation(() =>
        Promise.resolve({ status: 500 })
      );

      render(<Create />);

      user.type(screen.getByTestId("title-field"), title);
      user.type(screen.getByTestId("body-field"), body);

      user.click(screen.getByText("Submit"));

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith(
          `Operation failed: ${DEFAULT_ERROR_MESSAGE}`
        )
      );
    });
  });
});
