import { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { db } from '~/utils/db.server';
import { useActionData } from '@remix-run/react';
import { badRequest } from '~/utils/request.server';
import { requireUserId } from '~/utils/session.server';

function validateMotiNoteNote(note: string) {
  if (note.length < 10) {
    return 'That quote is too short!';
  }
}

function validateMotiNoteName(name: string) {
  if (name.length < 3) {
    return 'that name is too short!';
  }
}
export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const note = form.get('note');
  const name = form.get('name');

  if (typeof note !== 'string' || typeof name !== 'string') {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: 'Form not submitted correctly',
    });
  }

  const fields = { note, name };
  const fieldErrors = {
    note: validateMotiNoteNote(note),
    name: validateMotiNoteName(name),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const newNote = await db.motiNote.create({
    data: { ...fields, motiUserId: userId },
  });
  return redirect(`/motinotes/${newNote.id}`);
};

export default function NewMotinoteRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <p>Add your own Motinote</p>
      <form method="post">
        <div>
          <label>
            Note:{' '}
            <textarea
              name="note"
              defaultValue={actionData?.fields?.note}
              aria-invalid={Boolean(actionData?.fieldErrors?.note) || undefined}
              aria-errormessage={
                actionData?.fieldErrors?.note ? 'note-error' : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.note ? (
            <p className="form-validation-error" role="alert" id="note-error">
              {actionData.fieldErrors.note}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            name:{' '}
            <input
              type="text"
              name="name"
              defaultValue={actionData?.fields?.name}
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              aria-errormessage={
                actionData?.fieldErrors?.name ? 'name-error' : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p className="form-validation-error" role="alert" id="name-error">
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
