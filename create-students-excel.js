const ExcelJS = require('exceljs');

async function createExcelFile() {
  // Create a new workbook and add a worksheet named "Students"
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Students');

  // Define the columns based on your Student model fields (excluding auto-handled fields)
  worksheet.columns = [
    { header: 'firstName', key: 'firstName', width: 15 },
    { header: 'lastName', key: 'lastName', width: 15 },
    { header: 'tc', key: 'tc', width: 15 },
    { header: 'address', key: 'address', width: 30 },
    { header: 'phoneNumber1', key: 'phoneNumber1', width: 15 },
    { header: 'phoneNumber2', key: 'phoneNumber2', width: 15 },
    { header: 'parentName', key: 'parentName', width: 10 },
    { header: 'parentLastName', key: 'parentLastName', width: 10 },
    { header: 'parentAddress', key: 'parentAddress', width: 10 },
    { header: 'parentNumber1', key: 'parentNumber1', width: 10 },
    { header: 'parentTc', key: 'parentTc', width: 10 },
    { header: 'institutionKey', key: 'institutionKey', width: 20 },
  ];

  worksheet.addRow({
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    tc: '12345678901',
    address: 'İstanbul, Kadıköy',
    phoneNumber1: '05001234567',
    phoneNumber2: '05007654321',
    parentName: 'Mehmet',
    parentLastName: 'Yılmaz',
    parentAddress: 'Ankara, Çankaya',
    parentNumber1: '03121234567',
    parentTc: '10987654321',
    institutionKey: 'INST001',
  });
  worksheet.addRow({
    firstName: 'Ayşe',
    lastName: 'Demir',
    tc: '23456789012',
    address: 'İzmir, Karşıyaka',
    phoneNumber1: '05009876543',
    phoneNumber2: '',
    parentName: 'Fatma',
    parentLastName: 'Demir',
    parentAddress: 'İzmir, Bornova',
    parentNumber1: '02324567890',
    parentTc: '19876543210',
    institutionKey: 'INST002',
  });
  worksheet.addRow({
    firstName: 'Ali',
    lastName: 'Kaya',
    tc: '34567890123',
    address: 'Bursa, Osmangazi',
    phoneNumber1: '05001112233',
    phoneNumber2: '05004445566',
    parentName: 'Hasan',
    parentLastName: 'Kaya',
    parentAddress: 'Bursa, Nilüfer',
    parentNumber1: '02242223344',
    parentTc: '18765432109',
    institutionKey: 'INST003',
  });
  worksheet.addRow({
    firstName: 'Zeynep',
    lastName: 'Çelik',
    tc: '45678901234',
    address: 'Antalya, Muratpaşa',
    phoneNumber1: '05002223344',
    phoneNumber2: '',
    parentName: 'Emine',
    parentLastName: 'Çelik',
    parentAddress: 'Antalya, Konyaaltı',
    parentNumber1: '02423214567',
    parentTc: '17654321098',
    institutionKey: 'INST004',
  });
  worksheet.addRow({
    firstName: 'Mert',
    lastName: 'Şahin',
    tc: '56789012345',
    address: 'Adana, Seyhan',
    phoneNumber1: '05003334455',
    phoneNumber2: '05006667788',
    parentName: 'Sibel',
    parentLastName: 'Şahin',
    parentAddress: 'Adana, Yüreğir',
    parentNumber1: '03222121212',
    parentTc: '16543210987',
    institutionKey: 'INST005',
  });
  worksheet.addRow({
    firstName: 'Elif',
    lastName: 'Aydın',
    tc: '67890123456',
    address: 'Eskişehir, Tepebaşı',
    phoneNumber1: '05004445566',
    phoneNumber2: '',
    parentName: 'Zehra',
    parentLastName: 'Aydın',
    parentAddress: 'Eskişehir, Odunpazarı',
    parentNumber1: '02223334455',
    parentTc: '15432109876',
    institutionKey: 'INST006',
  });
  worksheet.addRow({
    firstName: 'Can',
    lastName: 'Güneş',
    tc: '78901234567',
    address: 'Konya, Selçuklu',
    phoneNumber1: '05005556677',
    phoneNumber2: '05008889900',
    parentName: 'Ali',
    parentLastName: 'Güneş',
    parentAddress: 'Konya, Meram',
    parentNumber1: '03324324324',
    parentTc: '14321098765',
    institutionKey: 'INST007',
  });
  worksheet.addRow({
    firstName: 'Derya',
    lastName: 'Koç',
    tc: '89012345678',
    address: 'Samsun, Atakum',
    phoneNumber1: '05006667788',
    phoneNumber2: '',
    parentName: 'Selma',
    parentLastName: 'Koç',
    parentAddress: 'Samsun, İlkadım',
    parentNumber1: '03622334455',
    parentTc: '13210987654',
    institutionKey: 'INST008',
  });
  worksheet.addRow({
    firstName: 'Emre',
    lastName: 'Polat',
    tc: '90123456789',
    address: 'Trabzon, Ortahisar',
    phoneNumber1: '05007778899',
    phoneNumber2: '05001112233',
    parentName: 'Murat',
    parentLastName: 'Polat',
    parentAddress: 'Trabzon, Yomra',
    parentNumber1: '04622334455',
    parentTc: '12109876543',
    institutionKey: 'INST009',
  });
  worksheet.addRow({
    firstName: 'Fatma',
    lastName: 'Yıldız',
    tc: '01234567890',
    address: 'Gaziantep, Şahinbey',
    phoneNumber1: '05008889900',
    phoneNumber2: '',
    parentName: 'Ahmet',
    parentLastName: 'Yıldız',
    parentAddress: 'Gaziantep, Şehitkamil',
    parentNumber1: '03424445566',
    parentTc: '11098765432',
    institutionKey: 'INST010',
  });

  await workbook.xlsx.writeFile('students.xlsx');
  console.log('Excel file "students.xlsx" has been created.');
}

createExcelFile().catch((error) => {
  console.error('Error creating Excel file:', error);
});
