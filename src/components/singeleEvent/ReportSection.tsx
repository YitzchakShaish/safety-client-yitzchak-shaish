import { Card, CardContent, Typography, Grid } from "@mui/material";
import EditableField from "./EditableField";
import { fieldLabels } from "../../types";


export default function ReportSection({ title, data, editableFields, onChange }: {
  title: string;
  data: Record<string, any>;
  section: "reporterInfo" | "eventInfo" | "summaryInfo";
  editableFields: string[];
  onChange: (field: string, value: any) => void;
}) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary" textAlign={"center"}>
          {title}
        </Typography>
        <Grid container spacing={3}>

          {/* // Loop through each field in the data and create a grid item with a label and editable field */}
          {Object.entries(data).map(([key, value]) => (
            <Grid size={{ sm: 6, md: 4, lg: 3 }} key={key}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {fieldLabels[key] || key}
              </Typography>

              {/* // Shows the field value and allows editing if the field is in editableFields */}
              <EditableField
                field={key}
                value={value}
                editable={editableFields.includes(key)}
                onChange={(newValue) => onChange(key, newValue)}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}