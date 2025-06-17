import * as Yup from 'yup';

const gamesSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    startTime: Yup.string().required('Start Date Time is required'),
    endTime: Yup.string().required('End Date Time is required'),
    resultTime: Yup.string().required('Result Date Time is required'),
})
export default gamesSchema;