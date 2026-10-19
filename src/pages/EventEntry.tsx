import { useRef, useState } from 'react';
import { Box, Stepper, Step, StepButton, Button, Alert, Typography, useTheme } from '@mui/material';
import ReporterInfo from '../components/EventForm/ReporterInfo';
import EventInfo from '../components/EventForm/EventInfo';
import SummaryInfo from '../components/EventForm/SummaryInfo';
import { innerBoxSx, outerBoxSx } from '../styles/eventEntry.styles';
import { useEventForm } from '../hooks/useEventForm';
import { createEventReport } from '../api/eventReport.api';
import StatusAlert from "../components/common/StatusAlert";
import { createInitialEventData } from '../context/eventFormContextBase';
import { useUser } from "../hooks/useUser";
import { uploadReportImages } from '../api/eventReportImages.api';


import { useNavigate } from 'react-router';

const steps = ["פרטי דיווח", "פרטי אירוע", "מסקנות והגשה"];
const stepComponents = [ReporterInfo, EventInfo, SummaryInfo];

export default function EventEntry() {
    const { updateUser } = useUser()
    const theme = useTheme();
    const navigate = useNavigate();
    const submitting = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [savedId, setSavedId] = useState<string | null>(null);
    const [imagesFailed, setImagesFailed] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
    const [stepValid, setStepValid] = useState(false);
    const { eventData, setEventData, setWeatherDetails } = useEventForm();
    const [images, setImages] = useState<File[]>([]);


    const [alert, setAlert] = useState<{
        open: boolean;
        status: number;
        message: string[];
    }>({ open: false, status: 0, message: [] });


    const totalSteps = steps.length;
    const completedSteps = Object.keys(completed).length;
    const allStepsCompleted = completedSteps === totalSteps;

    const handleBack = () => {
        const prev = activeStep - 1;
        setActiveStep(prev);
        setStepValid(completed[prev] || false);
    };

    const handleStep = (step: number) => {
        setActiveStep(step);
        setStepValid(completed[step] || false);
    };

    const handleComplete = () => {
        const nextCompleted = { ...completed, [activeStep]: true };
        setCompleted(nextCompleted);
        const nextStep = steps.findIndex((_, index) => !nextCompleted[index]);
        if (nextStep !== -1) {
            setActiveStep(nextStep);
            setStepValid(false);
        }
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
        setStepValid(false);
        setEventData(createInitialEventData());
        setWeatherDetails(null);
        setImages([]);
        setSavedId(null);
        setImagesFailed(false);
        setAlert({ open: false, status: 0, message: [] });
    };

    async function handleSubmit() {
        if (submitting.current || savedId) return;
        submitting.current = true;
        setIsSubmitting(true);
        try {
            const response = await createEventReport(eventData);
            if (!response.success || !response.id) {
                const message = response.message || "אירעה שגיאה ביצירת הדוח";
                setAlert({ open: true, status: response.status || 500,
                    message: Array.isArray(message) ? message : [message] });
                return;
            }
            setSavedId(response.id);
            setEventData(createInitialEventData());
            setWeatherDetails(null);
            if (response.user) updateUser(response.user);
            if (images.length > 0) {
                const result = await uploadReportImages(response.id, images);
                setImagesFailed(!result.success);
            }
        } finally {
            submitting.current = false;
            setIsSubmitting(false);
        }
    }

    async function retryImages() {
        if (!savedId || submitting.current) return;
        submitting.current = true;
        setIsSubmitting(true);
        try {
            const result = await uploadReportImages(savedId, images);
            setImagesFailed(!result.success);
        } finally {
            submitting.current = false;
            setIsSubmitting(false);
        }
    }

    if (savedId) return (
        <Box sx={outerBoxSx(theme)}>
            <Alert severity="success">דיווח האירוע נשמר בהצלחה</Alert>
            <Typography sx={{ my: 2 }}>מספר האירוע: {savedId}</Typography>
            {isSubmitting && <Typography>מעלה תמונות...</Typography>}
            {imagesFailed && <Alert severity="warning" sx={{ mb: 2 }}>
                האירוע נשמר, אך העלאת התמונות נכשלה.
                <Button disabled={isSubmitting} onClick={retryImages}>נסה להעלות שוב</Button>
            </Alert>}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="contained" disabled={isSubmitting} onClick={() => {
                    handleReset();
                    navigate(`/events/${savedId}`);
                }}>צפייה באירוע</Button>
                <Button variant="outlined" disabled={isSubmitting} onClick={handleReset}>דיווח אירוע נוסף</Button>
            </Box>
        </Box>
    );

    const CurrentStepComponent = stepComponents[activeStep];

    return (<>
        <Box sx={outerBoxSx(theme)}>
            <Stepper
                nonLinear
                activeStep={activeStep}
                sx={{
                    flexShrink: 0,
                    mb: 1,
                    '& .MuiStepLabel-label': {
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                    }
                }}
            >
                {steps.map((label, index) => (
                    <Step key={label} completed={completed[index]}>
                        <StepButton disabled={isSubmitting} onClick={() => handleStep(index)} sx={{
                            '& .MuiStepLabel-label': { mr: 1 },
                        }}>{label}</StepButton>
                    </Step>
                ))}
            </Stepper>

            <Box component="fieldset" disabled={isSubmitting} sx={{ ...innerBoxSx(theme), border: 0, m: 0, minWidth: 0 }}>
                <CurrentStepComponent onCompleteChange={(valid) => {
                    setStepValid(valid);
                    if (!valid) setCompleted(previous => {
                        const next = { ...previous };
                        delete next[activeStep];
                        return next;
                    });
                }} images={images} setImages={setImages} />
            </Box>
            <Box sx={{ display: 'flex', pt: 2, flexShrink: 0 }}>
                <Button disabled={isSubmitting || activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>הקודם</Button>
                <Box sx={{ flex: 1 }} />
                {allStepsCompleted ? (
                    <Button disabled={isSubmitting || !stepValid} onClick={handleSubmit}>{isSubmitting ? "שולח..." : "שליחה"}</Button>
                ) : (
                    <Button onClick={handleComplete} disabled={!stepValid}>
                        {completedSteps === totalSteps - 1 ? 'סיום' : 'סיים שלב'}
                    </Button>
                )}
            </Box>
        </Box>
        <StatusAlert
            open={alert.open}
            statusCode={alert.status}
            message={alert.message}
            onClose={() => setAlert({ ...alert, open: false })}
            duration={3000}
        />
    </>
    );
}
