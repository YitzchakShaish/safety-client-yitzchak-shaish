import { useState } from "react";
import { CardContent, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { Card, CardMedia } from "@mui/material";
import { Close } from "@mui/icons-material";
import { API_BASE_URL } from "../../config/env";

export default function EventImagesView({
  images,
}: {
  images: Array<{ id: string; fileName: string; filePath: string }>;
}) {
  const [open, setOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState<string>("");
  const BASE_URL = API_BASE_URL;
  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary" textAlign={"center"}>
            תמונות מהאירוע
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {images.map((img) => (
              <Grid size={{ xs: 12, sm: 6 }} key={img.id}>
                <Card
                  sx={{ width: "100%", height: 150, cursor: "pointer" }}
                  onClick={() => {
                    setCurrentImg(BASE_URL + "/" + img.filePath);
                    setOpen(true);
                  }}
                >
                  <CardMedia
                    component="img"
                    image={BASE_URL + "/" + img.filePath}
                    alt={img.fileName}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>

          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle sx={{ m: 0, p: 1 }}>
              <IconButton
                onClick={() => setOpen(false)}
                sx={{ position: "absolute", right: 8, top: 8 }}
              >
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent
              sx={{
                p: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#daceceff",
              }}
            >
              <img
                src={currentImg}
                style={{
                  maxWidth: "100%",
                  maxHeight: "90vh",
                  objectFit: "contain",
                }}
              />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </>
  );
}
