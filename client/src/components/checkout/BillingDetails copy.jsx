const BillingDetails = () => {
  return (
    <div className="w-full md:p-8">
      <form className=" mx-auto p-4">
        <h2 className="text-base font-medium mb-2 text-gray-600">
          Billing Details
        </h2>
        <div className="border mb-4"></div>
        <div className="flex w-full gap-5 mb-2">
          <div className="w-full mb-4 relative">
            <label className="block text-gray-700 mb-2 text-sm">
              First Name <span className="absolute left-[74px]">*</span>
            </label>
            <input
              type="text"
              className="w-full p-3 rounded bg-slate-100 outline-none text-sm"
              placeholder="First name"
            />
          </div>
          <div className="mb-4 w-full relative">
            <label className="block text-gray-700 mb-2 text-sm">
              Last Name <span className="absolute left-[74px]">*</span>
            </label>
            <input
              type="text"
              className="w-full p-3 rounded bg-slate-100 outline-none text-sm"
              placeholder="Last name"
            />
          </div>
        </div>
        <div className="mb-4 w-full relative">
          <label className="block text-gray-700 mb-2 text-sm">
            Email Address <span className="absolute left-[95px]"> *</span>
          </label>
          <input
            type="email"
            className="w-full p-3 rounded bg-slate-100 outline-none text-sm"
            placeholder="Email address"
          />
        </div>
        <div className="mb-4 relative">
          <label className="block text-gray-700 mb-2 text-sm">
            Phone *
            </label>
          <input
            type="text"
            className="w-full p-3 rounded bg-slate-100 outline-none text-sm"
            placeholder="Phone"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-sm">
          District *
          </label>
          <input
            type="text"
            className="w-full p-3 rounded bg-slate-100 outline-none text-sm"
            placeholder="District"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-sm">
          Upazilla *
          </label>
          <input
            type="text"
            className="w-full p-3 rounded bg-slate-100 outline-none text-sm"
            placeholder="Upazilla"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-sm">
          Area *
          </label>
          <input
            type="text"
            className="w-full p-3 rounded bg-slate-100 outline-none text-sm"
            placeholder="area"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 text-sm">
            Post Code  *
            </label>
          <input
            type="text"
            className="w-full p-3 rounded bg-slate-100 outline-none text-sm"
            placeholder="Post Code"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-sm">
            Street Address  *
          </label>
          <input
            type="text"
            className="w-full p-3 rounded bg-slate-100 outline-none text-sm"
            placeholder="House number and street name"
          />
        </div>
        <div className="border border-b-0 mb-4 "></div>
        <div className="mb-2">
          <label className="block text-gray-700 mb-2 text-sm">
            Order notes (optional) (optional)
          </label>
          <textarea
            type="text"
            className="w-full h-32 p-3 rounded bg-slate-100 outline-none text-sm"
            placeholder="Company name"
          />
        </div>
      </form>
    </div>
  );
};

export default BillingDetails;
