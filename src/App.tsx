import { useEffect, useState } from 'react';
import PlayIcon from './components/icons/PlayIcon';
import VideoRecord from './components/record/VideoRecord';
import ViewQrRecord from './components/record/ViewQrRecord';
import PlayButton from './components/ui/buttons/PlayButton';
import { getRecords, listRecords } from './services/record.service';
import { Record } from './types/record.type';

const App = () => {
  const [initRecord, setInitRecord] = useState(false);
  const [records, setRecords] = useState<Record[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [image, setImage] = useState('');

  const handleClick = async (recordId: number) => {
    try {
      const data = await getRecords(recordId);
      setImage(data);
      setIsOpenModal(true);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    listRecords().then((res) => setRecords(res));
  }, []);

  return (
    <main className="w-screen h-screen grid place-content-center bg-gray-200">
      <section className="flex flex-col gap-8 items-center">
        <h1 className="text-center font-bold text-7xl">Video Record</h1>
        {!initRecord ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4 font-semibold text-gray-700">
              <PlayButton handleClick={() => setInitRecord(true)}>
                <PlayIcon />
              </PlayButton>
              <p>Init a new record</p>
            </div>
            {records.map((record) => (
              <div
                key={record.recordId}
                className="bg-gray-400 p-3 rounded-xl cursor-pointer"
                onClick={() => handleClick(record.recordId)}
              >
                <p>{record.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <VideoRecord setInitRecord={setInitRecord} setRecords={setRecords} />
        )}
      </section>
      {isOpenModal && (
        <ViewQrRecord setIsOpenModal={setIsOpenModal} srcImage={image} />
      )}
    </main>
  );
};

export default App;
