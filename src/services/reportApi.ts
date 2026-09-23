import { api } from './api';

export const fetchReports = async () => {
  const response = await api.get('/reports');
  return response.data;
};

export const fetchReportAnalysis = async (id: string | number) => {
  const response = await api.get(`/reports/${id}`);
  return response.data;
};

export const deleteReport = async (id: string | number) => {
  const response = await api.delete(`/reports/${id}`);
  return response.data;
};

export const uploadReport = async (file: File, title: string, reportType: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('report_type', reportType);

  const response = await api.post('/uploads/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};