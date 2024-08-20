import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

interface FormWarningProps {
    message?: string
}

export const FormError = ({ message: errorMessage }: FormWarningProps) => {
    if (!errorMessage) return null;

    return (
        <p className="text-red-500 bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm">
            <FaExclamationTriangle className="h-4 w-4" />
            {errorMessage}
        </p>
    );
};

export const FormSuccess = ({ message }: FormWarningProps) => {
    if(!message) return null;

    return (
        <p className="text-emerald-500 bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm">
            <FaCheckCircle className="h-4 w-4"/>
            {message}
            </p>
    )
}

