import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const profilePictureUrls = [
  'https://res.cloudinary.com/dnlclcfck/image/upload/f_auto,q_auto/v1/concord/usericons/default/kzthyw6gpkiexwz3zdy7',
  'https://res.cloudinary.com/dnlclcfck/image/upload/f_auto,q_auto/v1/concord/usericons/default/t4013tqlq9ucnf6bdndh',
  'https://res.cloudinary.com/dnlclcfck/image/upload/f_auto,q_auto/v1/concord/usericons/default/achdpcf2uzzjhdnpvarg',
  'https://res.cloudinary.com/dnlclcfck/image/upload/f_auto,q_auto/v1/concord/usericons/default/trstjcr66taklbna1yq1',
  'https://res.cloudinary.com/dnlclcfck/image/upload/f_auto,q_auto/v1/concord/usericons/default/oot8nmqy5eljk8uxgmlc',
  'https://res.cloudinary.com/dnlclcfck/image/upload/f_auto,q_auto/v1/concord/usericons/default/fiblzwmqsjsek5sxbkjh',
  'https://res.cloudinary.com/dnlclcfck/image/upload/f_auto,q_auto/v1/concord/usericons/default/eod2pn7yaxakdsqujpto',
  'https://res.cloudinary.com/dnlclcfck/image/upload/f_auto,q_auto/v1/concord/usericons/default/nakympmcpls2gpouv9uw',
]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
