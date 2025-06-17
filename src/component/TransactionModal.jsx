import {
  Box,
  Button,
  Modal,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { BASE_URL } from "../costants";

const TransactionSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .positive("Amount must be greater than zero"),
  description: Yup.string().optional(),
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const TransactionModal = ({
  open,
  handleClose,
  type,
  id,
  setSnackbarMessage,
  setSnackbarSeverity,
  setSnackbarOpen,
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2} fontWeight={700}>
          {type.charAt(0).toUpperCase() + type.slice(1)} Amount
        </Typography>

        <Formik
          initialValues={{ amount: "", description: "" }}
          validationSchema={TransactionSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              const { data } = await axios.post(
                `${BASE_URL}/api/web/create/transaction`,
                {
                  customerId: id,
                  type,
                  ...values,
                },
                {
                  headers: {
                    Authorization: localStorage.getItem("token"),
                  },
                }
              );
              setSnackbarMessage(data?.message);
              setSnackbarSeverity("success");
              if (data?.type === "success") {
                resetForm();
                handleClose();
              }
            } catch (err) {
              console.log("Error in credit/debit API", err.message);
              setSnackbarMessage(err.message);
              setSnackbarSeverity("error");
            } finally {
              setSnackbarOpen(true);
            }
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Stack spacing={2}>
                <Field
                  as={TextField}
                  name="amount"
                  label="Amount*"
                  type="number"
                  error={touched.amount && !!errors.amount}
                  helperText={touched.amount && errors.amount}
                  fullWidth
                //   inputProps={{
                //     inputMode: "decimal",
                //     pattern: "[0-9]+(\\.[0-9]{1,2})?",
                //   }}
                //   onInput={(e) => {
                //     // Allow only numbers and one dot
                //     e.target.value = e.target.value
                //       .replace(/[^0-9.]/g, "")
                //       .replace(/(\..*)\./g, "$1");
                //   }}
                />

                <Field
                  as={TextField}
                  name="description"
                  label="Description (Optional)"
                  fullWidth
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleClose}
                    sx={{
                      mr: 1,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="success">
                    Submit
                  </Button>
                </Box>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default TransactionModal;
