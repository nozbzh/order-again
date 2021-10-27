/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import axios from "axios";
import toast from "react-hot-toast";

import DetailsPage from "pages/notes/[id]";

const mockRouter = { push: jest.fn() };
jest.mock("next/router", () => ({
  ...jest.requireActual<any>("next/router"),
  useRouter: () => mockRouter
}));

jest.mock("react-hot-toast");
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

afterEach(() => {
  jest.clearAllMocks();
});

const id = "123";
const title = "The Title";
const body = "the body";
const lastUpdatedAt = 12345;

const note = { id, title, body, lastUpdatedAt };

describe("Details page", () => {
  describe("click on delete", () => {
    describe("when it is successful", () => {
      it("calls axios with the expected arguments", async () => {
        render(<DetailsPage note={note} />);

        user.click(screen.getByText("Delete"));

        await waitFor(() =>
          expect(mockedAxios.delete).toHaveBeenCalledWith(`/api/notes/${id}`)
        );
      });

      it("calls toast with the expected message", async () => {
        render(<DetailsPage note={note} />);

        user.click(screen.getByText("Delete"));

        await waitFor(() =>
          expect(toast.success).toHaveBeenCalledWith("Deleted!")
        );
      });

      it("navigates to the homepage", async () => {
        render(<DetailsPage note={note} />);

        user.click(screen.getByText("Delete"));

        await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith("/"));
      });
    });

    describe("when it fails", () => {
      it("calls toast with the expected message", async () => {
        mockedAxios.delete.mockImplementation(() => {
          throw new Error("boom");
        });

        render(<DetailsPage note={note} />);

        user.click(screen.getByText("Delete"));

        await waitFor(() =>
          expect(toast.error).toHaveBeenCalledWith(
            "Could not delete note: if this persists please notify the GlassNotes team"
          )
        );
      });

      it("does not navigate to the homepage", async () => {
        mockedAxios.delete.mockImplementation(() => {
          throw new Error("boom");
        });

        render(<DetailsPage note={note} />);

        user.click(screen.getByText("Delete"));

        await waitFor(() => expect(mockRouter.push).not.toHaveBeenCalled());
      });
    });
  });

  describe("click on edit button", () => {
    it("navigates to the edit", async () => {
      render(<DetailsPage note={note} />);

      user.click(screen.getByText("Edit"));

      await waitFor(() =>
        expect(mockRouter.push).toHaveBeenCalledWith(`/notes/edit/${id}`)
      );
    });
  });

  describe("displaying the note", () => {
    it("it displays the title", () => {
      render(<DetailsPage note={note} />);

      expect(screen.getByText(note.title)).toBeInTheDocument();
    });

    it("it displays the body", () => {
      render(<DetailsPage note={note} />);

      expect(screen.getByText(note.body)).toBeInTheDocument();
    });

    it("it displays the last updated at", () => {
      render(<DetailsPage note={note} />);

      expect(
        screen.getByText(
          `Last updated at: ${new Date(note.lastUpdatedAt).toLocaleString()}`
        )
      ).toBeInTheDocument();
    });
  });
});
