import { useState } from 'react';
import { Box, Stepper, Step, StepButton, Button, useTheme } from '@mui/material';
import ReporterInfo from '../components/eventForm/ReporterInfo';
import EventInfo from '../components/eventForm/EventInfo';
import SummaryInfo from '../components/eventForm/SummaryInfo';
import { innerBoxSx, outerBoxSx } from '../styles/eventEntry.styles';
import { useEventForm } from '../hooks/useEventForm';
import { createEventReport } from '../api/eventReport.api';
import StatusAlert from "../components/common/StatusAlert";
import { initialEventData } from '../context/EventFormContext';


const steps = ["פרטי דיווח", "פרטי אירוע", "מסקנות והגשה"];
const stepComponents = [ReporterInfo, EventInfo, SummaryInfo];

export default function EventEntry() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
    const [stepValid, setStepValid] = useState(false);
    const { eventData, setEventData } = useEventForm();

    const [alert, setAlert] = useState<{
        open: boolean;
        status: number;
        message: string[];
    }>({ open: false, status: 0, message: [] });


    const totalSteps = steps.length;
    const completedSteps = Object.keys(completed).length;
    const isLastStep = activeStep === totalSteps - 1;
    const allStepsCompleted = completedSteps === totalSteps;

    const handleNext = () => {
        const newStep = isLastStep && !allStepsCompleted
            ? steps.findIndex((_, i) => !(i in completed))
            : activeStep + 1;
        setActiveStep(newStep);
        setStepValid(completed[newStep] || false);
    };

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
        setCompleted({ ...completed, [activeStep]: true });
        handleNext();
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
        setStepValid(false);
        setEventData(initialEventData);
    };

    async function handleSubmit() {
        console.log("Form submitted:", eventData);
        const response = await createEventReport(eventData)
        console.log(response)

        if (response.success) {
            setAlert({
                open: true,
                status: response.status,
                message: [response.message]
            });
            handleReset();
        } else {
            setAlert({
                open: true,
                status: response.status,
                message: response.message || []
            });
        }

    }


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
                        <StepButton onClick={() => handleStep(index)} sx={{
                            '& .MuiStepLabel-label': { mr: 1 },
                        }}>{label}</StepButton>
                    </Step>
                ))}
            </Stepper>

            <Box sx={innerBoxSx(theme)}>
                <CurrentStepComponent onCompleteChange={setStepValid} />
            </Box>
            <Box sx={{ display: 'flex', pt: 2, flexShrink: 0 }}>
                <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>הקודם</Button>
                <Box sx={{ flex: 1 }} />
                {allStepsCompleted ? (
                    <Button onClick={() => handleSubmit()}>שליחה</Button>
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
