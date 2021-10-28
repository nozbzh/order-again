/**
 * @jest-environment jsdom
 */

import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor
} from "@testing-library/react";
import axios from "axios";
import toast from "react-hot-toast";

import Home from "../../pages/index";
import { DEFAULT_ERROR_MESSAGE } from "utils/ui";

jest.mock("react-hot-toast");
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Home page", () => {
  it("renders the title", async () => {
    render(<Home />);
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const title = screen.getByText(/my notes/i);

    expect(title).toBeInTheDocument();
  });

  describe("when there are notes", () => {
    it("renders the list", async () => {
      const note1 = { title: "Hello", body: "coconut", id: "1" };
      const note2 = { title: "Hi", body: "pineapple", id: "2" };

      mockedAxios.get.mockImplementation(() =>
        Promise.resolve({ data: { payload: [note1, note2] } })
      );

      render(<Home />);
      expect(screen.getByText(/my notes/i)).toBeInTheDocument();

      await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

      expect(screen.getByText(note1.title)).toBeInTheDocument();
      expect(screen.getByText(note2.title)).toBeInTheDocument();
    });
  });

  describe("when there are no notes", () => {
    it("renders the no notes message", async () => {
      mockedAxios.get.mockImplementation(() =>
        Promise.resolve({ data: { payload: [] } })
      );

      render(<Home />);
      expect(screen.getByText(/my notes/i)).toBeInTheDocument();

      await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

      expect(screen.getByText("No notes yet")).toBeInTheDocument();
    });
  });

  describe("when fetching fails", () => {
    it("calls toast with the expected message", async () => {
      mockedAxios.get.mockImplementation(() => {
        throw new Error("uh oh");
      });

      render(<Home />);
      expect(screen.getByText(/my notes/i)).toBeInTheDocument();

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith(
          `Could not fetch notes: ${DEFAULT_ERROR_MESSAGE}`
        )
      );
    });
  });
});
