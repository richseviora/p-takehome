import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";

export function ShowDialog(props: { onClose: () => void }) {
  return (
    <Dialog open={true} onClose={props.onClose} maxWidth="lg" fullWidth>
      <DialogTitle id="modal-modal-title" variant="h2" component="h2">
        Show List Not Yet Available
      </DialogTitle>
      <Box>
        <DialogContent>Someday soon!</DialogContent>
      </Box>
    </Dialog>
  );
}
