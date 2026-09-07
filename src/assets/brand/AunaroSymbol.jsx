// Isologotipo AUNARO: símbolo oficial (export real de diseño), no una reconstrucción.
// Fuente: public/brand/aunaro-simbolo.png (recortado a su bounding box real).
export default function AunaroSymbol({ size = 24, className }) {
  return (
    <img
      src="/brand/aunaro-simbolo.png"
      alt=""
      style={{ height: size, width: 'auto' }}
      className={className}
      aria-hidden="true"
    />
  )
}
