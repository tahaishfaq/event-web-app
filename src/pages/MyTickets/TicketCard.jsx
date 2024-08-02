// TicketCard.js
import React, { useRef, useState } from 'react';
import QRCode from 'qrcode.react';
import { PDFDownloadLink, Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { toPng } from 'html-to-image';
import moment from 'moment';

const TicketCard = ({ ticket }) => {
  const {
    additional_info,
    category,
    event_address,
    event_date_and_time,
    event_description,
    event_max_capacity,
    event_title,
  } = ticket;

  const qrCodeRef = useRef(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const generateQrCodeUrl = async () => {
    if (qrCodeRef.current) {
      const dataUrl = await toPng(qrCodeRef.current);
      setQrCodeUrl(dataUrl);
    }
  };

  const styles = StyleSheet.create({
    page: {
      padding: 20,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    qrCode: {
      margin: '20px auto',
    },
    qrImage: {
      width: 128,
      height: 128,
      margin: '20px auto',
    },
  });

  const TicketPDF = () => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text>Event Title: {event_title}</Text>
          <Text>Event Date and Time: {new Date(event_date_and_time).toLocaleString()}</Text>
          <Text>Event Address: {event_address}</Text>
          <Text>Category: {category}</Text>
          <Text>Description: {event_description}</Text>
          <Text>Max Capacity: {event_max_capacity}</Text>
          <Text>Additional Info: {additional_info}</Text>
        </View>
        {qrCodeUrl && (
          <Image style={styles.qrImage} src={qrCodeUrl} />
        )}
      </Page>
    </Document>
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">{event_title}</h2>
      <p className="mb-2"><strong>Event Date and Time:</strong> {moment(event_date_and_time).format('lll')}</p>
      <p className="mb-2"><strong>Event Address:</strong> {event_address}</p>
      <p className="mb-2"><strong>Category:</strong> {category}</p>
      <p className="mb-2"><strong>Description:</strong> {event_description}</p>
      <p className="mb-2"><strong>Max Capacity:</strong> {event_max_capacity}</p>
      <p className="mb-2"><strong>Additional Info:</strong> {additional_info}</p>
      <div ref={qrCodeRef} className="flex justify-center my-4">
        <QRCode value={`Event: ${event_title}`} size={128} />
      </div>
      <button
        onClick={generateQrCodeUrl}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Generate PDF
      </button>
      {qrCodeUrl && (
        <PDFDownloadLink document={<TicketPDF />} fileName={`${event_title}_ticket.pdf`}>
          {({ loading }) => (loading ? 'Loading document...' : 'Download Ticket as PDF')}
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default TicketCard;
