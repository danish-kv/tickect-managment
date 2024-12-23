import * as Yup from "yup";

export const createTicketValidatioin = Yup.object({
    title: Yup.string().required("Ticket title is required"),
    description: Yup.string().required("Description is required"),
    priority: Yup.string().oneOf(["Low", "Medium", "High"]).required("Priority is required"),
  });
