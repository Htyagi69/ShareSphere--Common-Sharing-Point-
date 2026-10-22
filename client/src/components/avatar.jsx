import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export function AvatarWithBadge({profileImage}) {
  return (
    <Avatar>
      <AvatarImage src={profileImage || "https://github.com/shadcn.png"} alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
      <AvatarBadge />
    </Avatar>
  )
}
