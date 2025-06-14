export function showToast(root, message, id = 'toast') {
  root?.getElementById(id)?.show(message);
}
