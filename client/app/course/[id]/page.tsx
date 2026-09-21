'use client'
import CourseDetailsPage from  "../../components/Course/CourseDetailsPage"

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <div>
      <CourseDetailsPage id={id} />
    </div>
  );
};

export default Page;
