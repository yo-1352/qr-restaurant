export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Περίγυρος</h1>
      <p className="text-gray-600 text-sm">
        Σκανάρετε το QR code στο τραπέζι σας και κάντε την παραγγελία σας. Οι παραγγελίες εμφανίζονται σε πραγματικό χρόνο στην κουζίνα.
      </p>
      <div className="space-y-2 text-sm">
        <p>
          To test the customer flow, open a URL like{" "}
          <span className="font-mono bg-gray-200 px-2 py-1 rounded">
            /table/1
          </span>{" "}
          in your browser.
        </p>
        <p>
          To test the kitchen flow, go to{" "}
          <span className="font-mono bg-gray-200 px-2 py-1 rounded">
            /kitchen/login
          </span>{" "}
          and log in with your Supabase admin credentials, then open{" "}
          <span className="font-mono bg-gray-200 px-2 py-1 rounded">
            /kitchen
          </span>
          .
        </p>
      </div>
    </div>
  );
}

