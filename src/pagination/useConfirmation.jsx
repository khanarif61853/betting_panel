import React, {useState} from "react";
import {
    Modal,
    ModalDialog,
    DialogTitle,
    DialogContent,
    Divider,
    ModalClose,
    DialogActions,
    Button,
    Typography
} from '@mui/joy';

export const useConfirmation = (title = "Warning Alert", message = "Are you sure You Want to Delete The Record?") => {
    const [confirmAction, setConfirmAction] = useState(() => () => {});
    const [cancelAction, setCancelAction] = useState(() => () => {});
    const [open, setOpen] = useState(false);

    const actions = (onConfirm, onCancel) => {
        setConfirmAction(() => onConfirm);
        setCancelAction(() => onCancel);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setConfirmAction(() => () => {});
        setCancelAction(() => () => {});
    };

    const handleConfirm = () => {
        confirmAction();
        handleClose();
    };

    const handleCancel = () => {
        cancelAction();
        handleClose();
    };

    const ConfirmationDialog = () => (
        <Modal
            open={open}
            onClose={handleCancel}
            sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        >
            <ModalDialog variant="outlined" minWidth={"sm"}>
                <DialogTitle>
                    {title}
                </DialogTitle>
                <ModalClose/>
                <Divider/>
                <DialogContent>
                    <Typography>{message}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleCancel} size="sm">Cancel</Button>
                    <Button variant="solid" onClick={handleConfirm} size="sm">Confirm</Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
    );
    return [ConfirmationDialog, actions];
};