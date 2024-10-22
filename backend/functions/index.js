import * as functions from 'firebase-functions';

// Import all services
import { loginUser, getUserDetails, logoutUser } from './auth/index.js';
import { checkDrugInteractions } from './drugInteractions/index.js';
import { getPatientLabData, setLabMonitoring } from './labMonitoring/index.js';
import { getNotificationsForUser, addNotificationForPatient } from './notifications/index.js';
import { retrievePatientPrescriptions, validatePrescriptionInput, customizePrescription, checkPolypharmacyRisks, addPrescription } from './prescriptions/index.js';
import { getUserPatients, getPatientData } from './patients/index.js';

// Auth Functions
export const loginUserFn = loginUser;
export const getUserDetailsFn = getUserDetails;
export const logoutUserFn = logoutUser;

// Drug Interaction Functions
export const checkDrugInteractionsFn = checkDrugInteractions;

// Lab Monitoring Functions
export const getPatientLabDataFn = getPatientLabData;
export const setLabMonitoringFn = setLabMonitoring;

// Prescription Validation and Customization Functions
export const retrievePatientPrescriptionsFn = retrievePatientPrescriptions;
export const validatePrescriptionInputFn = validatePrescriptionInput;
export const customizePrescriptionFn = customizePrescription;
export const checkPolypharmacyRisksFn = checkPolypharmacyRisks;
export const addPrescriptionFn = addPrescription;

// Notifications Functions
export const getNotificationsForUserFn = getNotificationsForUser;
export const addNotificationForPatientFn = addNotificationForPatient;

// Patient Data Functions
export const getPatientDataFn = getPatientData;
export const getUserPatientsFn = getUserPatients;
