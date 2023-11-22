import Modal from '../ui/modal/Modal';

interface ViewQrRecordProps {
  srcImage: string;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ViewQrRecord = ({ srcImage, setIsOpenModal }: ViewQrRecordProps) => {
  return (
    <Modal setIsOpenModal={setIsOpenModal}>
      <img src={srcImage} />
    </Modal>
  );
};

export default ViewQrRecord;
