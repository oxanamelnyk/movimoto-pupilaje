import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

export type InvoicePdfData = {
  invoiceNumber: string;
  invoiceDate: string;
  periodStart: string;
  periodEnd: string;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  total: number;
  logoSrc: string;
};

const yellow = "#fff500";
const gray = "#d4d4d4";

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 34,
    paddingVertical: 28,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#111111",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logo: { width: 225, height: 69, objectFit: "contain" },
  company: {
    width: 205,
    textAlign: "right",
    lineHeight: 1,
    fontSize: 8.5,
    color: "#555555",
  },
  companyName: { fontFamily: "Helvetica-Bold" },
  clientSection: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: { width: "40%", fontFamily: "Helvetica-Bold", fontSize: 18 },
  clientBox: {
    width: "58%",
    minHeight: 72,
    border: "1.5 solid #111111",
    borderRadius: 14,
    padding: 10,
    lineHeight: 1.6,
  },
  clientName: { fontFamily: "Helvetica-Bold", fontSize: 11 },
  meta: { marginTop: 16, flexDirection: "row", border: "1 solid #111111" },
  metaColumn: { width: "50%", textAlign: "center" },
  yellowCell: { backgroundColor: yellow, padding: 6, fontFamily: "Helvetica-Bold" },
  grayCell: { backgroundColor: gray, padding: 6 },
  payment: { marginTop: 18, border: "1.5 solid #111111" },
  paymentRow: { flexDirection: "row", minHeight: 20, borderBottom: "1 solid #111111" },
  paymentLastRow: { flexDirection: "row", minHeight: 20 },
  paymentLabel: { width: 120, padding: 5 },
  paymentValue: { flex: 1, padding: 5, fontFamily: "Helvetica-Bold" },
  table: { marginTop: 18, borderLeft: "1 solid #111111", borderTop: "1 solid #111111" },
  tableRow: { flexDirection: "row" },
  tableHeader: { backgroundColor: yellow, fontFamily: "Helvetica-Bold" },
  service: { width: "18%" },
  description: { width: "47%" },
  price: { width: "13%" },
  quantity: { width: "9%" },
  amount: { width: "13%" },
  tableCell: {
    padding: 6,
    borderRight: "1 solid #111111",
    borderBottom: "1 solid #111111",
    justifyContent: "center",
  },
  serviceRowCell: { minHeight: 92 },
  serviceName: { fontSize: 8 },
  serviceDescription: { textAlign: "center", lineHeight: 1.25 },
  centered: { textAlign: "center" },
  right: { textAlign: "right" },
  totals: { marginTop: 28, borderLeft: "1 solid #111111", borderTop: "1 solid #111111" },
  totalHeaderRow: { flexDirection: "row", backgroundColor: yellow },
  totalValueRow: { flexDirection: "row", backgroundColor: gray },
  totalCell: {
    width: "14.2857%",
    padding: 6,
    textAlign: "center",
    borderRight: "1 solid #111111",
    borderBottom: "1 solid #111111",
  },
  bold: { fontFamily: "Helvetica-Bold" },
  footer: {
    position: "absolute",
    left: 34,
    right: 34,
    bottom: 18,
    textAlign: "center",
    color: "#777777",
    fontSize: 8,
  },
});

function money(value: number): string {
  return `${value.toFixed(2)} €`;
}

function serviceDescription(periodStart: string, periodEnd: string): string {
  const period =
    periodStart === periodEnd
      ? `EL DÍA ${periodStart}`
      : `DEL ${periodStart} AL ${periodEnd}`;

  return `REALIZACIÓN DE SERVICIOS DE ALMACENAMIENTO DE MOTOCICLETAS - DURANTE EL PERÍODO ${period}`;
}

export function createInvoicePdfDocument(data: InvoicePdfData) {
  return (
    <Document
      title={`Factura ${data.invoiceNumber}`}
      author="MOVI MOTO 552 SL"
      subject="Factura de almacenamiento"
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header} fixed>
          {/* React PDF's Image is not a DOM img and has no alt prop. */}
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={data.logoSrc} style={styles.logo} />
          <View style={styles.company}>
            <Text style={styles.companyName}>MOVI MOTO 552 SL</Text>
            <Text>CIF: B-66526021</Text>
            <Text>Travesía Prat de la Riba nº118</Text>
            <Text>08849 – Sant Climent de Llobregat</Text>
            <Text>BARCELONA</Text>
            <Text>Tel.: +34620413663</Text>
            <Text>info@movimoto.net</Text>
          </View>
        </View>

        <View style={styles.clientSection}>
          <Text style={styles.title}>FACTURA CLIENTE</Text>
          <View style={styles.clientBox}>
            <Text style={styles.clientName}>{data.clientName}</Text>
            {data.clientEmail ? <Text>{data.clientEmail}</Text> : null}
            {data.clientPhone ? <Text>{data.clientPhone}</Text> : null}
          </View>
        </View>

        <View style={styles.meta}>
          <View style={styles.metaColumn}>
            <Text style={styles.yellowCell}>FACTURA</Text>
            <Text style={styles.grayCell}>{data.invoiceNumber}</Text>
          </View>
          <View style={styles.metaColumn}>
            <Text style={styles.yellowCell}>FECHA</Text>
            <Text style={styles.grayCell}>{data.invoiceDate}</Text>
          </View>
        </View>

        <View style={styles.payment}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Forma de Pago:</Text>
            <Text style={styles.paymentValue}>TRANSFERENCIA BANCARIA</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Banco:</Text>
            <Text style={styles.paymentValue}>
              CAJA DE AHORROS Y PENSIONES DE BARCELONA
            </Text>
          </View>
          <View style={styles.paymentLastRow}>
            <Text style={styles.paymentLabel}>CCC - IBAN</Text>
            <Text style={styles.paymentValue}>
              ES07 2100 0801 1002 0111 0848
            </Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]} fixed>
            <Text style={[styles.tableCell, styles.service, styles.centered]}>SERVICIO</Text>
            <Text style={[styles.tableCell, styles.description, styles.centered]}>DESCRIPCIÓN</Text>
            <Text style={[styles.tableCell, styles.price, styles.centered]}>Precio U.</Text>
            <Text style={[styles.tableCell, styles.quantity, styles.centered]}>Cant.</Text>
            <Text style={[styles.tableCell, styles.amount, styles.centered]}>Importe</Text>
          </View>
          <View style={styles.tableRow} wrap={false}>
            <Text
              style={[
                styles.tableCell,
                styles.serviceRowCell,
                styles.service,
                styles.serviceName,
                styles.centered,
              ]}
            >
              ALMACENAMIENTO
            </Text>
            <Text
              style={[
                styles.tableCell,
                styles.serviceRowCell,
                styles.description,
                styles.serviceDescription,
              ]}
            >
              {serviceDescription(data.periodStart, data.periodEnd)}
            </Text>
            <Text
              style={[
                styles.tableCell,
                styles.serviceRowCell,
                styles.price,
                styles.right,
              ]}
            >
              {money(data.subtotal)}
            </Text>
            <Text
              style={[
                styles.tableCell,
                styles.serviceRowCell,
                styles.quantity,
                styles.centered,
              ]}
            >
              1
            </Text>
            <Text
              style={[
                styles.tableCell,
                styles.serviceRowCell,
                styles.amount,
                styles.right,
              ]}
            >
              {money(data.subtotal)}
            </Text>
          </View>
        </View>

        <View style={styles.totals} wrap={false}>
          <View style={styles.totalHeaderRow}>
            {[
              "Importe",
              "% Dcto",
              "Imp. Dcto",
              "Base Imponible",
              "% IVA",
              "Imp. IVA",
              "Total Documento",
            ].map((label) => (
              <Text key={label} style={[styles.totalCell, styles.bold]}>{label}</Text>
            ))}
          </View>
          <View style={styles.totalValueRow}>
            <Text style={styles.totalCell}>{money(data.subtotal)}</Text>
            <Text style={styles.totalCell}>0.00%</Text>
            <Text style={styles.totalCell}>{money(0)}</Text>
            <Text style={styles.totalCell}>{money(data.subtotal)}</Text>
            <Text style={styles.totalCell}>{data.taxPercentage.toFixed(2)}%</Text>
            <Text style={styles.totalCell}>{money(data.taxAmount)}</Text>
            <Text style={[styles.totalCell, styles.bold]}>{money(data.total)}</Text>
          </View>
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `${data.invoiceNumber} · Página ${pageNumber} de ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}

export function InvoicePdfDocument({ data }: { data: InvoicePdfData }) {
  return createInvoicePdfDocument(data);
}
