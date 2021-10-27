/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import axios from "axios";
import toast from "react-hot-toast";

import Edit from "pages/notes/edit/[id]";

jest.mock("react-hot-toast");
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

afterEach(() => {
  jest.clearAllMocks();
});

const id = "123";
const title = "the title";
const body = "the body";
const lastUpdatedAt = 12345;

const note = { id, title, body, lastUpdatedAt };

const newData = " is new";

describe("Edit page", () => {
  describe("when submit is successful", () => {
    it("calls axios with the expected arguments", async () => {
      render(<Edit note={note} />);

      user.type(screen.getByTestId("title-field"), newData);
      user.type(screen.getByTestId("body-field"), newData);

      user.click(screen.getByText("Submit"));

      await waitFor(() =>
        expect(mockedAxios.patch).toHaveBeenCalledWith(`/api/notes/${id}`, {
          title: `${title}${newData}`,
          body: `${body}${newData}`
        })
      );
    });

    it("calls toast with the expected message", async () => {
      render(<Edit note={note} />);

      user.type(screen.getByTestId("title-field"), newData);
      user.type(screen.getByTestId("body-field"), newData);

      user.click(screen.getByText("Submit"));

      await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Saved!"));
    });
  });

  describe("when submit fails", () => {
    it("calls toast with the expected message", async () => {
      mockedAxios.patch.mockImplementation(() =>
        Promise.resolve({ status: 500 })
      );

      render(<Edit note={note} />);

      user.type(screen.getByTestId("title-field"), newData);
      user.type(screen.getByTestId("body-field"), newData);

      user.click(screen.getByText("Submit"));

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith(
          "Operation failed: if this persists please notify the GlassNotes team"
        )
      );
    });
  });
});
