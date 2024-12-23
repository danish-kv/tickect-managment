import React from "react";
import { X } from "lucide-react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { createTicketValidatioin } from "../../../validation/YupValidatioin";

const CreateTicketForm = ({ onClose, onSubmit }) => {
  const initialValues = {
    title: "",
    description: "",
    priority: "Low",
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New Ticket
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={createTicketValidatioin}
          onSubmit={async (values, { resetForm }) => {
            await onSubmit(values);
            resetForm();
            onClose();
          }}
        >
          {({ setFieldValue }) => (
            <Form className="p-6">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ticket Title *
                  </label>
                  <Field
                    type="text"
                    name="title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Brief summary of the issue"
                  />
                  <div className="text-red-500 text-sm mt-1">
                    <ErrorMessage name="title" />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Detailed explanation of the issue"
                  />
                  <div className="text-red-500 text-sm mt-1">
                    <ErrorMessage name="description" />
                  </div>
                </div>

                {/* Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority *
                    </label>
                    <Field
                      as="select"
                      name="priority"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </Field>
                    <div className="text-red-500 text-sm mt-1">
                      <ErrorMessage name="priority" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Ticket
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateTicketForm;
