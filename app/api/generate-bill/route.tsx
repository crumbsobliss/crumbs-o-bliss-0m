import React from 'react';
import { NextResponse } from 'next/server';
import { Page, Text, View, Document, StyleSheet, renderToStream } from '@react-pdf/renderer';
import { createClient } from '@/utils/supabase/server';
import details from '@/config/details.json';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#ffffff', color: '#1a1a1a' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#ebebeb', paddingBottom: 20, marginBottom: 20 },
  storeInfo: { display: 'flex', flexDirection: 'column' },
  storeName: { fontSize: 24, fontWeight: 'bold', color: '#ea580c', marginBottom: 4 },
  storeDetails: { fontSize: 10, color: '#6b7280', marginBottom: 2 },
  invoiceTitleWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  invoiceTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', letterSpacing: 1 },
  invoiceDetails: { fontSize: 10, color: '#6b7280', marginTop: 4 },
  statusBadge: { 
    marginTop: 8, padding: '4px 8px', borderRadius: 12, backgroundColor: '#ffedd5' 
  },
  statusText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', color: '#c2410c' },
  billedToContainer: { marginBottom: 30 },
  billedToLabel: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', color: '#9ca3af', letterSpacing: 1, marginBottom: 4 },
  customerName: { fontSize: 14, fontWeight: 'bold', color: '#1f2937' },
  customerDetails: { fontSize: 10, color: '#4b5563', marginTop: 4 },
  
  table: { width: '100%', marginBottom: 30 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#1f2937', paddingBottom: 8, marginBottom: 8 },
  tableHeaderItem: { fontSize: 10, fontWeight: 'bold', color: '#4b5563', textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingTop: 12, paddingBottom: 12 },
  col1: { width: '40%' },
  col2: { width: '20%', textAlign: 'center' },
  col3: { width: '20%', textAlign: 'right' },
  col4: { width: '20%', textAlign: 'right' },
  tableCell: { fontSize: 10, color: '#1f2937' },
  tableCellBold: { fontSize: 10, fontWeight: 'bold', color: '#1f2937' },

  summaryContainer: { display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' },
  summaryBox: { width: '50%' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingTop: 6, paddingBottom: 6 },
  summaryLabel: { fontSize: 10, color: '#4b5563' },
  summaryValue: { fontSize: 10, fontWeight: 'bold', color: '#1f2937' },
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f9fafb', padding: 12, borderRadius: 6, marginTop: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  grandTotalLabel: { fontSize: 14, fontWeight: 'bold', color: '#1f2937' },
  grandTotalValue: { fontSize: 18, fontWeight: 'bold', color: '#ea580c' },
  
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, textAlign: 'center', borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 20 },
  footerText: { fontSize: 10, color: '#6b7280', fontStyle: 'italic' }
});

const InvoiceDocument = ({ order, invoiceDate }: { order: any, invoiceDate: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{details.store.name}</Text>
          <Text style={styles.storeDetails}>{details.store.slogan}</Text>
          <Text style={styles.storeDetails}>{details.location.address}, {details.location.city}</Text>
          <Text style={styles.storeDetails}>Phone: {details.contact.primaryPhone}</Text>
        </View>
        <View style={styles.invoiceTitleWrapper}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <Text style={styles.invoiceDetails}>#{order.ticket_id}</Text>
          <Text style={styles.invoiceDetails}>Date: {invoiceDate}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>
      </View>

      {/* Billed To */}
      <View style={styles.billedToContainer}>
        <Text style={styles.billedToLabel}>Billed To</Text>
        <Text style={styles.customerName}>{order.user_name}</Text>
        <Text style={styles.customerDetails}>{order.delivery_address || 'Pickup'}</Text>
        <Text style={styles.customerDetails}>Phone: {order.user_phone}</Text>
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderItem, styles.col1]}>Item Description</Text>
          <Text style={[styles.tableHeaderItem, styles.col2]}>Qty</Text>
          <Text style={[styles.tableHeaderItem, styles.col3]}>Price</Text>
          <Text style={[styles.tableHeaderItem, styles.col4]}>Total</Text>
        </View>
        
        {order.order_items.map((item: any, i: number) => (
          <View style={styles.tableRow} key={i}>
            <Text style={[styles.tableCell, styles.col1]}>{item.product_name}</Text>
            <Text style={[styles.tableCell, styles.col2]}>{item.quantity}</Text>
            <Text style={[styles.tableCell, styles.col3]}>Rs. {item.price_at_time}</Text>
            <Text style={[styles.tableCellBold, styles.col4]}>Rs. {item.quantity * item.price_at_time}</Text>
          </View>
        ))}
      </View>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>Rs. {order.total_amount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>Rs. 0.00</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>Rs. {order.total_amount}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Thank you for your business. Let's bliss together!</Text>
      </View>
      
    </Page>
  </Document>
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticketId = searchParams.get('ticket_id');

  if (!ticketId) {
    return NextResponse.json({ error: 'Missing ticket_id' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('ticket_id', ticketId)
    .single();

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const invoiceDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  try {
    const stream = await renderToStream(<InvoiceDocument order={order} invoiceDate={invoiceDate} />);

    // Consume the NodeJS stream into a Buffer
    const chunks: any[] = [];
    for await (const chunk of stream as any) {
      chunks.push(Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${order.ticket_id}.pdf"`
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
