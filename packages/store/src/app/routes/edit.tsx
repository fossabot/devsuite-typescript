import { FC } from 'react';
import { Form, useLoaderData, useNavigate, redirect, ActionFunction } from 'react-router-dom';
import { Contact, updateContact } from '../data/contacts';

export const action: ActionFunction = async ({ request, params }) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData as any);
    await updateContact(params['contactId'], updates);
    return redirect(`/contacts/${params['contactId']}`);
};

export const EditContact: FC = () => {
    const contact = useLoaderData() as Contact;
    const navigate = useNavigate();

    return (
        <Form method="post" id="contact-form">
            <p>
                <span>Name</span>
                <input
                    placeholder="First"
                    aria-label="First name"
                    type="text"
                    name="first"
                    defaultValue={contact.first}
                />
                <input
                    placeholder="Last"
                    aria-label="Last name"
                    type="text"
                    name="last"
                    defaultValue={contact.last}
                />
            </p>
            <label>
                <span>Twitter</span>
                <input
                    type="text"
                    name="twitter"
                    placeholder="@jack"
                    defaultValue={contact.twitter}
                />
            </label>
            <label>
                <span>Avatar URL</span>
                <input
                    placeholder="https://example.com/avatar.jpg"
                    aria-label="Avatar URL"
                    type="text"
                    name="avatar"
                    defaultValue={contact.avatar}
                />
            </label>
            <label>
                <span>Notes</span>
                <textarea
                    name="notes"
                    defaultValue={contact.notes}
                    rows={6}
                />
            </label>
            <p>
                <button type="submit" onClick={() => {
                    navigate(-1);
                }}>Save</button>
                <button type="button">Cancel</button>
            </p>
        </Form>
    );
};

export default EditContact;