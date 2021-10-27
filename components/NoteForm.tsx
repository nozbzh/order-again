import * as React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import { NoteInterface } from "types";
import { notifyError, notifySuccess, getErrorMessage } from "utils/ui";

interface NoteFormProps {
  note?: NoteInterface;
}

const NoteForm = ({ note }: NoteFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const isEdit = Boolean(note);

  const onSubmit = async noteData => {
    setLoading(true);
    try {
      if (isEdit) {
        const url = `/api/notes/${note.id}`;
        await axios.patch(url, noteData);
        notifySuccess("Saved!");
      } else {
        const url = `/api/notes`;
        await axios.post(url, noteData);
        notifySuccess("Created!");
      }
      router.push("/");
    } catch (e: any) {
      notifyError(`Operation failed: ${getErrorMessage(e)}`);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        data-testid="title-field"
        defaultValue={isEdit ? note.title : ""}
        {...register("title", { required: true })}
      />
      {errors.title && <span>This field is required</span>}

      <textarea
        data-testid="body-field"
        defaultValue={isEdit ? note.body : ""}
        {...register("body", { required: true })}
      />

      {errors.body && <span>This field is required</span>}

      <input type="submit" value={loading ? "..." : "Submit"} />
    </form>
  );
};

export default NoteForm;
