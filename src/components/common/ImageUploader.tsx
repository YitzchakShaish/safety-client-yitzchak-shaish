import { Grid, Button, Card, CardMedia, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";



export default function ImageUploader({ images, setImages }: {
    images: File[],
    setImages: (files: File[]) => void;
}
) {

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages([...images, ...Array.from(e.target.files)]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Button variant="contained" component="label">
                    העלאת תמונה
                    <input type="file" hidden multiple onChange={handleFileChange} />
                </Button>
            </Grid>

            {/* Preview */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {images.map((file, idx) => (
                    <Grid  size={{ xs: 12, sm: 6 }} key={idx}>
                        <Card sx={{ width: '100%', height: 150, position: 'relative' }}>
                            <CardMedia
                                component="img"
                                image={URL.createObjectURL(file)}
                                alt={file.name}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <IconButton
                                size="small"
                                sx={{ position: 'absolute', top: 0, right: 0, color: 'white' }}
                                onClick={() => removeImage(idx)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
}
