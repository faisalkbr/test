import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProductDetail } from '../../hooks/useProducts';
import { formatCurrency } from '../../lib/formatCurrency';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import { Icons } from '../../components/icons';
import EditProductModal from '../../components/products/EditProductModal';
import DeleteProductDialog from '../../components/products/DeleteProductDialog';

function relativeDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} hari lalu`;
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function Field({ label, children, big, mono }) {
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div
        className={`mt-1 ${mono ? 'font-mono' : ''} ${
          big ? 'text-[22px] font-medium tracking-[-0.015em]' : 'text-sm'
        } text-ink-950`}
      >
        {children}
      </div>
    </div>
  );
}

function MetaRow({ label, children }) {
  return (
    <div className="flex justify-between items-center gap-2">
      <span className="text-[12.5px] text-ink-500">{label}</span>
      <span className="text-[13px] text-ink-900">{children}</span>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: product, isLoading, isError, error } = useProductDetail(id);

  if (isLoading) {
    return (
      <>
        <PageHeader
          breadcrumb={[
            { label: 'Produk', to: '/products' },
            { label: 'Memuat…' },
          ]}
          title="Memuat detail produk"
        />
        <div className="px-10 pt-5">
          <div className="bg-paper border border-ink-150 rounded-[14px] p-6 text-ink-500">
            Memuat data...
          </div>
        </div>
      </>
    );
  }

  if (isError || !product) {
    return (
      <>
        <PageHeader
          breadcrumb={[
            { label: 'Produk', to: '/products' },
            { label: 'Tidak ditemukan' },
          ]}
          title="Produk tidak ditemukan"
          actions={
            <Button
              variant="secondary"
              leading={<Icons.arrowLeft size={14} />}
              onClick={() => navigate('/products')}
            >
              Kembali
            </Button>
          }
        />
        <div className="px-10 pt-5">
          <div className="bg-paper border border-danger-600 rounded-[14px] p-6 text-danger-600">
            {error?.message || 'Produk yang Anda cari tidak tersedia.'}
          </div>
        </div>
      </>
    );
  }

  const idTail = String(product.id).slice(-3).toUpperCase();

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: 'Produk', to: '/products' },
          { label: product.name },
        ]}
        title={product.name}
        actions={
          <>
            <Button
              variant="secondary"
              leading={<Icons.arrowLeft size={14} />}
              onClick={() => navigate('/products')}
            >
              Kembali
            </Button>
            <Button
              variant="secondary"
              leading={<Icons.edit size={14} />}
              onClick={() => setEditOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              leading={<Icons.trash size={14} />}
              onClick={() => setDeleteOpen(true)}
            >
              Hapus
            </Button>
          </>
        }
      />

      <div className="px-10 pt-5 pb-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
        {/* Hero card */}
        <div className="bg-paper border border-ink-150 rounded-[14px] overflow-hidden shadow-[0_1px_0_rgba(10,11,10,0.04)]">
          <div
            className="h-[200px] relative border-b border-ink-100"
            style={{
              background:
                'linear-gradient(135deg, var(--color-brand-50) 0%, var(--color-paper) 80%)',
            }}
          >
            <span
              className="font-mono absolute font-semibold text-brand-700"
              style={{
                right: -20,
                bottom: -40,
                fontSize: 220,
                opacity: 0.18,
                letterSpacing: '-0.05em',
                lineHeight: 1,
              }}
            >
              {idTail}
            </span>
            <div className="absolute top-[18px] left-[22px] flex gap-2">
              <span className="px-2.5 py-1 bg-paper rounded-full text-xs font-medium text-brand-700 border border-brand-200">
                Aktif
              </span>
              <span className="font-mono px-2.5 py-1 bg-paper rounded-full text-[11px] text-ink-500 border border-ink-150">
                {product.id}
              </span>
            </div>
          </div>

          <div className="px-7 py-6">
            <span className="eyebrow">Produk Konsultasi</span>
            <h2
              className="m-0 mt-1.5 mb-2.5"
              style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em' }}
            >
              {product.name}
            </h2>
            <p className="m-0 text-ink-500 text-[14.5px] leading-[1.6] max-w-[580px]">
              Penawaran terstandar untuk mitra 180DC UNAIR. Harga sudah mencakup
              brief intake, diagnostic, dan delivery final report.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-7 pt-6 border-t border-ink-100">
              <Field label="Harga" big mono>
                {formatCurrency(product.price)}
              </Field>
              <Field label="ID Produk" mono>
                {product.id}
              </Field>
              <Field label="Owner ID" mono>
                {product.owner_id ?? '—'}
              </Field>
              <Field label="Status">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-500" /> Aktif
                </span>
              </Field>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-4">
          <div className="bg-paper border border-ink-150 rounded-[14px] p-5 shadow-[0_1px_0_rgba(10,11,10,0.04)]">
            <span className="eyebrow">Metadata</span>
            <div className="mt-3 flex flex-col gap-3">
              <MetaRow label="Dibuat">
                {product.created_at
                  ? new Date(product.created_at).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—'}
              </MetaRow>
              <MetaRow label="Terakhir">{relativeDate(product.created_at)}</MetaRow>
              <MetaRow label="Pemilik">
                <span className="inline-flex items-center gap-1.5">
                  <Avatar name={`Owner ${product.owner_id}`} size={20} />
                  Owner #{product.owner_id ?? '—'}
                </span>
              </MetaRow>
            </div>
          </div>

          <div className="bg-paper border border-ink-150 rounded-[14px] p-5 shadow-[0_1px_0_rgba(10,11,10,0.04)]">
            <span className="eyebrow">Aktivitas</span>
            <div className="mt-3.5 relative">
              <div className="absolute left-[7px] top-1.5 bottom-1.5 w-px bg-ink-150" />
              <div className="pl-[22px] pb-3.5 relative">
                <span
                  className="absolute w-2 h-2 rounded-full bg-brand-500 border-2 border-paper"
                  style={{
                    left: 4,
                    top: 5,
                    boxShadow: '0 0 0 1px var(--color-ink-150)',
                  }}
                />
                <div className="text-[13px] font-medium text-ink-900">
                  Produk dibuat
                </div>
                <div className="text-xs text-ink-500 mt-0.5">
                  oleh Owner #{product.owner_id ?? '—'} ·{' '}
                  {relativeDate(product.created_at)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProductModal
        productId={editOpen ? product.id : null}
        onClose={() => setEditOpen(false)}
      />
      <DeleteProductDialog
        product={deleteOpen ? product : null}
        onClose={() => setDeleteOpen(false)}
        onSuccess={() => navigate('/products')}
      />
    </>
  );
}
