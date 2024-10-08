export const getBadgeColor = (type: string) => {
  switch (type) {
    case "u8":
    case "u16":
    case "u32":
    case "u64":
    case "i8":
    case "i16":
    case "i32":
    case "i64":
      return "bg-[#1e5159] text-[#43b5c5]";
    case "string":
      return "bg-[#116939] text-[#26e97e]";
    case "publicKey":
    case "bool":
      return "bg-[#712c71] text-[#fa62fc]";
    default:
      return "bg-[#512965] text-[#b45be1]"; // For custom or defined types
  }
};
