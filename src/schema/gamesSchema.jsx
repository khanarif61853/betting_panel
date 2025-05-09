import * as Yup from 'yup';

const gamesSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    startDateTime: Yup.string().required('Start Date Time is required'),
    endDateTime: Yup.string().required('End Date Time is required'),
    resultDateTime: Yup.string().required('Result Date Time is required'),
})
export default gamesSchema;