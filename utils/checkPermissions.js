import CustomError from "../errors";

//HEAD:       A UTILITY FUNCTION FOR CHECKING THE PERMISSION      //
export const checkPermissions = (requestUser, resourceUserId) => {
  // console.log("🚀 ~ file: checkPermissions.js ~ line 5 ~ checkPermissions ~ resourceUserId", resourceUserId)
  // console.log("🚀 ~ file: checkPermissions.js ~ line 5 ~ checkPermissions ~ requestUser", requestUser)
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new CustomError.UnauthorizedError(
    "Not authorized to access this route"
  );
};
