import {
  Accessibility,
  ArrowUpFromLine,
  Camera,
  Car,
  Check,
  CircleCheck,
  ClipboardList,
  Calendar,
  Clock,
  Cloud,
  Download,
  FileBadge,
  Flame,
  FlaskConical,
  FolderOpen,
  Gavel,
  GraduationCap,
  HardHat,
  LayoutDashboard,
  ListChecks,
  Lock,
  MapPin,
  PoundSterling,
  RefreshCw,
  Scale,
  Search,
  ShieldAlert,
  Smartphone,
  Timer,
  Truck,
  Users,
  WifiOff,
  Wrench,
  type LucideProps,
} from 'lucide-react'
import type { IconName } from '@/lib/platform'

/**
 * PlatformIcon — resolves the icon names used in lib/platform.ts (which
 * stays JSX-free so Node tests can import it) to lucide components.
 *
 * @example
 *   <PlatformIcon name="gavel" className="size-4" />
 */
const ICONS: Record<IconName, React.ComponentType<LucideProps>> = {
  'clipboard-list': ClipboardList,
  gavel: Gavel,
  'list-checks': ListChecks,
  truck: Truck,
  search: Search,
  'circle-check': CircleCheck,
  'file-badge': FileBadge,
  'hard-hat': HardHat,
  'shield-alert': ShieldAlert,
  'graduation-cap': GraduationCap,
  'folder-open': FolderOpen,
  'layout-dashboard': LayoutDashboard,
  'map-pin': MapPin,
  'wifi-off': WifiOff,
  camera: Camera,
  scale: Scale,
  accessibility: Accessibility,
  'pound-sterling': PoundSterling,
  cloud: Cloud,
  users: Users,
  lock: Lock,
  download: Download,
  timer: Timer,
  flame: Flame,
  'arrow-up-from-line': ArrowUpFromLine,
  'flask-conical': FlaskConical,
  wrench: Wrench,
  car: Car,
  calendar: Calendar,
  clock: Clock,
  smartphone: Smartphone,
  'refresh-cw': RefreshCw,
  check: Check,
}

export function PlatformIcon({ name, ...props }: { name: IconName } & LucideProps) {
  const Icon = ICONS[name]
  return <Icon aria-hidden="true" {...props} />
}
