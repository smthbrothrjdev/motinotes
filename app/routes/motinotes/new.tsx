export default function NewMotinoteRoute() {
  return (
    <div>
      <p>Add your own Motinote</p>
      <form method="post">
        <div>
          <label>
            Note: <textarea name="note" />
          </label>
        </div>
        <div>
          <label>
            name: <input type="text" name="name" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
