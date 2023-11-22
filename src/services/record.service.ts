import { API } from '../constants/api';
import { Record } from '../types/record.type';

export const listRecords = async () => {
  try {
    const response = await fetch(API.RECORD_API);
    const dataJson = await response.json();

    if (!response.ok) {
      throw new Error(dataJson);
    }

    const records: Record[] = dataJson.map((item: any) => ({
      recordId: item.record_id,
      name: item.name,
      location: item.location,
    }));

    return records;
  } catch (error) {
    const err = error as Error;
    throw new Error(err.message);
  }
};

export const getRecords = async (recordId: number) => {
  try {
    const response = await fetch(`${API.RECORD_API}/${recordId}`);
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    return imageUrl;
  } catch (error) {
    const err = error as Error;
    console.log({ err });
    throw new Error(err.message);
  }
};

export const createRecord = async (blob: Blob) => {
  const formData = new FormData();
  formData.append('record', blob, `${new Date().valueOf()}.mp4`);

  const response = await fetch(API.RECORD_API, {
    method: 'POST',
    body: formData,
  });
  const dataJson = await response.json();

  const record: Record = {
    recordId: dataJson.record_id,
    name: dataJson.name,
    location: dataJson.location,
  };

  return record;
};
