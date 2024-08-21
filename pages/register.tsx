import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import LoadIcon from '../components/LoadIcon';
import { RequestHelper } from '../lib/request-helper';
import { useAuthContext } from '../lib/user/AuthContext';
import { Formik, Form } from 'formik';
import { hackPortalConfig, generateInitialValues } from '../hackportal.config';
import DisplayQuestion from '../components/registerComponents/DisplayQuestion';
import { getFileExtension } from '../lib/util';
import Link from 'next/link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { GetServerSideProps } from 'next';

interface RegisterPageProps {
  allowedRegistrations: boolean;
}

/**
 * The registration page.
 *
 * Registration: /
 */

export default function Register({ allowedRegistrations }: RegisterPageProps) {
  const router = useRouter();

  const {
    registrationFields: {
      generalQuestions,
      schoolQuestions,
      hackathonExperienceQuestions,
      shortAnswerQuestions,
      eventInfoQuestions,
      sponsorInfoQuestions,
      teammateQuestions,
    },
  } = hackPortalConfig;

  const { user, profile, hasProfile, updateProfile } = useAuthContext();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  // update this to false for testing
  const [loading, setLoading] = useState(false);
  const [registrationSection, setRegistrationSection] = useState(
    profile?.currentRegistrationPage || 0,
  );
  const checkRedirect = async () => {
    if (!allowedRegistrations) return;
    if (hasProfile) router.push('/profile');
    if (user) setLoading(false);
  };

  // disable this for testing
  useEffect(() => {
    checkRedirect();
  }, [user]);

  const cleanData = (registrationData) => {
    let cleanedValues = { ...registrationData };
    const userValues = {
      id: registrationData.id,
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      preferredEmail: registrationData.preferredEmail,
      permissions: registrationData.permissions,
    };
    cleanedValues['user'] = userValues;
    delete cleanedValues.firstName;
    delete cleanedValues.lastName;
    delete cleanedValues.permissions;
    delete cleanedValues.preferredEmail;
    return cleanedValues;
  };

  const handleSubmit = async (registrationData) => {
    registrationData = cleanData(registrationData);
    if (registrationData['university'] === 'Other') {
      registrationData['university'] = registrationData['universityManual'];
    }

    if (registrationData['major'] === 'Other') {
      registrationData['major'] = registrationData['majorManual'];
    }

    if (registrationData['heardFrom'] === 'Other') {
      registrationData['heardFrom'] = registrationData['heardFromManual'];
    }

    delete registrationData.universityManual;
    delete registrationData.majorManual;
    delete registrationData.heardFromManual;
    let resumeUrl: string = '';
    try {
      if (resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('fileName', `${user.id}${getFileExtension(resumeFile.name)}`);
        formData.append('studyLevel', registrationData['studyLevel']);
        formData.append('major', registrationData['major']);

        const res = await fetch('/api/resume/upload', {
          method: 'post',
          body: formData,
        });
        resumeUrl = (await res.json()).url;
      }
      const { data } = await RequestHelper.put<
        Registration,
        { msg: string; registrationData: Registration }
      >(
        '/api/applications/save',
        {},
        {
          ...registrationData,
          id: registrationData.id || user.id,
          user: {
            ...registrationData.user,
            id: registrationData.user.id || user.id,
          },
          resume: resumeUrl,
          currentRegistrationPage: 1000000000,
        },
      );
      alert('Application Submitted');
      updateProfile(data.registrationData);
      router.push('/profile');
    } catch (error) {
      console.error(error);
      console.log('Request creation error');
    }
  };

  const handleSaveProfile = (
    registrationData: any,
    nextPage: number,
    resetForm: (param: { values: any }) => void,
  ) => {
    const cleanedData = cleanData(registrationData);
    return RequestHelper.put<any, { msg: string; registrationData: Registration }>(
      '/api/applications/save',
      {},
      {
        ...cleanedData,
        id: cleanedData.id || user.id,
        user: {
          ...cleanedData.user,
          id: cleanedData.user.id || user.id,
        },
        currentRegistrationPage: nextPage,
      },
    )
      .then(() => {
        resetForm({ values: registrationData });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files.length !== 1) return alert('Must submit one file');

    const file = e.target.files[0];

    const fileExtension = getFileExtension(file.name);

    const acceptedFileExtensions = [
      '.pdf',
      '.doc',
      '.docx',
      '.png',
      '.jpg',
      '.jpeg',
      '.txt',
      '.tex',
      '.rtf',
    ];

    if (!acceptedFileExtensions.includes(fileExtension))
      return alert(`Accepted file types: ${acceptedFileExtensions.join(' ')}`);

    setResumeFile(file);
  };

  if (!allowedRegistrations) {
    return (
      <h1 className="mx-auto text-2xl mt-4 font-bold">
        Registrations is closed and no longer allowed
      </h1>
    );
  }

  // disable this for testing
  if (!user) {
    // If user haven't signed in, redirect them to login page
    router.push('/auth');
  }

  if (loading) {
    return <LoadIcon width={200} height={200} />;
  }

  //disables submitting form on enter key press
  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  const setErrors = (obj, values, errors) => {
    if (obj.textInputQuestions)
      for (let inputObj of obj.textInputQuestions) {
        if (inputObj.required) {
          if (!values[inputObj.name]) errors[inputObj.name] = 'Required';
        }
      }
    if (obj.numberInputQuestions)
      for (let inputObj of obj.numberInputQuestions) {
        if (inputObj.required) {
          if (isNaN(parseInt(values[inputObj.name]))) {
            errors[inputObj.name] = 'Invalid number';
          } else if (!values[inputObj.name] && values[inputObj.name] !== 0)
            errors[inputObj.name] = 'Required';
        }
      }
    if (obj.dropdownQuestions)
      for (let inputObj of obj.dropdownQuestions) {
        if (inputObj.required) {
          if (!values[inputObj.name]) errors[inputObj.name] = 'Required';
        }
      }
    if (obj.checkboxQuestions)
      for (let inputObj of obj.checkboxQuestions) {
        if (inputObj.required) {
          if (!values[inputObj.name] || values[inputObj.name].length === 0)
            errors[inputObj.name] = 'Required';
        }
      }
    if (obj.datalistQuestions)
      for (let inputObj of obj.datalistQuestions) {
        if (inputObj.required) {
          if (!values[inputObj.name]) errors[inputObj.name] = 'Required';
        }
      }
    if (obj.textAreaQuestions)
      for (let inputObj of obj.textAreaQuestions) {
        if (inputObj.required) {
          if (!values[inputObj.name]) errors[inputObj.name] = 'Required';
        }
      }

    return errors;
  };

  return (
    <div className="flex flex-col flex-grow">
      <Head>
        <title>Hacker Application</title>
        <meta name="description" content="Register for HackUTD 2024" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="pl-4 relative mb-4">
        <Link href="/" passHref>
          <div className="cursor-pointer items-center inline-flex text-white font-bold bg-[#40B7BA] rounded-[30px] pr-4 pl-1 py-2 border-2 border-white">
            <ChevronLeftIcon className="text-white" fontSize={'large'} />
            Home
          </div>
        </Link>
      </section>

      <section className="relative">
        <Formik
          initialValues={{
            ...generateInitialValues(profile),
            id: profile?.user.id || '',
            firstName: profile?.user.firstName || '',
            lastName: profile?.user.lastName || '',
            preferredEmail: profile?.user.preferredEmail || user.preferredEmail,
            majorManual: profile?.majorManual || '',
            universityManual: profile?.universityManual || '',
            heardFromManual: profile?.heardFromManual || '',
          }}
          validateOnBlur={false}
          validateOnChange={false}
          //validation
          //Get condition in which values.[value] is invalid and set error message in errors.[value]. Value is a value from the form(look at initialValues)
          validate={(values) => {
            var errors: any = {};
            for (let obj of generalQuestions) {
              errors = setErrors(obj, values, errors);
            }
            for (let obj of schoolQuestions) {
              errors = setErrors(obj, values, errors);
            }
            for (let obj of hackathonExperienceQuestions) {
              errors = setErrors(obj, values, errors);
            }
            for (let obj of shortAnswerQuestions) {
              errors = setErrors(obj, values, errors);
            }
            for (let obj of eventInfoQuestions) {
              errors = setErrors(obj, values, errors);
            }
            for (let obj of sponsorInfoQuestions) {
              errors = setErrors(obj, values, errors);
            }
            for (let obj of teammateQuestions) {
              errors = setErrors(obj, values, errors);
            }

            const validPhoneNumber = /^(1[ -]?)?\d{3}[ -]?\d{3}[ -]?\d{4}$/.test(
              values['phoneNumber'],
            );
            if (!validPhoneNumber) {
              errors.phoneNumber = 'Invalid phone number';
            }

            //additional custom error validation
            if (
              values.preferredEmail &&
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.preferredEmail)
            ) {
              //regex matches characters before @, characters after @, and 2 or more characters after . (domain)
              errors.preferredEmail = 'Invalid email address';
            }
            if ((values.age && values.age < 1) || values.age > 100) {
              errors.age = 'Not a valid age';
            }
            if (
              (values.hackathonExperience && values.hackathonExperience < 0) ||
              values.hackathonExperience > 100
            ) {
              errors.hackathonExperience = 'Not a valid number';
            }

            if (values['major'] === 'Other' && values['majorManual'] === '') {
              errors['majorManual'] = 'Required';
            }

            if (values['university'] === 'Other' && values['universityManual'] === '') {
              errors['universityManual'] = 'Required';
            }

            if (values['heardFrom'] === 'Other' && values['heardFromManual'] === '') {
              errors['heardFromManual'] = 'Required';
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            //submitting
            await handleSubmit(values);
            setSubmitting(false);
            // alert(JSON.stringify(values, null, 2)); //Displays form results on submit for testing purposes
          }}
        >
          {({ values, isValid, isSubmitting, dirty, resetForm }) => (
            <>
              {/* Field component automatically hooks input to form values. Use name attribute to match corresponding value */}
              {/* ErrorMessage component automatically displays error based on validation above. Use name attribute to match corresponding value */}
              <Form
                onKeyDown={onKeyDown}
                className="registrationForm px-4 md:px-24 w-full sm:text-base text-sm"
              >
                {/* General Questions */}
                {registrationSection == 0 && (
                  <section className="bg-white lg:w-3/5 md:w-3/4 w-full min-h-[35rem] mx-auto rounded-2xl md:py-4 py-10 px-8 mb-8 text-[#4C4950]">
                    <header>
                      <h1 className="text-[#40B7BA] lg:text-4xl sm:text-3xl text-2xl font-bold text-center mt-2 md:mt-8 mb-4 poppins-bold">
                        Hacker Appplication
                      </h1>
                      <div
                        style={{ color: '#A6A4A8' }}
                        className="poppins-regular text-center text-md mb-4 font-light"
                      >
                        Please fill out the following fields. The application should take
                        approximately 10 minutes.
                      </div>
                    </header>
                    <div className="md:px-10">
                      <div className="flex flex-col">
                        {generalQuestions.map((obj, idx) => (
                          <DisplayQuestion key={idx} obj={obj} />
                        ))}
                      </div>
                      <div className="text-[#00000080] poppins-regular mt-4 font-semibold mb-2">
                        Applying for travel reimbursement?
                        <a href="https://acmutd.typeform.com/to/RxlL9v8R" target="_blank">
                          <span className="ml-2 text-[#40B7BA] underline cursor-pointer">
                            Click here!
                          </span>
                        </a>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        disabled={!dirty}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSaveProfile(values, registrationSection, resetForm).then(() => {
                            alert('Profile saved');
                          });
                        }}
                        className="bg-[#40B7BA] rounded-lg p-3 text-white font-bold"
                      >
                        Save Profile
                      </button>
                    </div>
                  </section>
                )}

                {/* School Questions */}
                {registrationSection == 1 && (
                  <section className="bg-white lg:w-3/5 md:w-3/4 w-full min-h-[35rem] mx-auto rounded-2xl md:py-10 py-6 px-8 mb-8 text-[#4C4950]">
                    <h2 className="sm:text-2xl text-xl sm:mb-3 mb-1 poppins-bold mt-2">
                      School Info
                    </h2>
                    <div className="flex flex-col md:px-4 poppins-regular ">
                      {schoolQuestions.map((obj, idx) => (
                        <DisplayQuestion key={idx} obj={obj} />
                      ))}
                      {values['major'] === 'Other' && (
                        <DisplayQuestion
                          key={1000}
                          obj={{
                            textInputQuestions: [
                              {
                                id: 'majorManual',
                                name: 'majorManual',
                                question: 'What is your major?',
                                required: values['major'] === 'Other',
                                initialValue: '',
                              },
                            ],
                          }}
                        />
                      )}
                      {values['university'] === 'Other' && (
                        <DisplayQuestion
                          key={1001}
                          obj={{
                            textInputQuestions: [
                              {
                                id: 'universityManual',
                                name: 'universityManual',
                                question: 'What is your university?',
                                required: values['university'] === 'Other',
                                initialValue: '',
                              },
                            ],
                          }}
                        />
                      )}
                    </div>
                    <div className="flex justify-end my-4">
                      <button
                        disabled={!dirty}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSaveProfile(values, registrationSection, resetForm).then(() => {
                            alert('Profile saved');
                          });
                        }}
                        className="bg-[#40B7BA] rounded-lg p-3 text-white font-bold"
                      >
                        Save Profile
                      </button>
                    </div>
                  </section>
                )}

                {/* Hackathon Questions */}
                {registrationSection == 2 && (
                  <section className="bg-white lg:w-3/5 md:w-3/4 w-full min-h-[35rem] mx-auto rounded-2xl md:py-10 py-6 px-8 mb-8 text-[#4C4950]">
                    <h2 className="sm:text-2xl text-xl poppins-bold sm:mb-3 mb-1 mt-2">
                      Hackathon Experience
                    </h2>
                    <div className="flex flex-col poppins-regular md:px-4">
                      {hackathonExperienceQuestions.map((obj, idx) => (
                        <DisplayQuestion key={idx} obj={obj} />
                      ))}
                      {values['heardFrom'] === 'Other' && (
                        <DisplayQuestion
                          key={1000}
                          obj={{
                            textInputQuestions: [
                              {
                                id: 'heardFromManual',
                                name: 'heardFromManual',
                                question: 'Where did you hear about HackUTD Ripple Effect?',
                                required: values['heardFrom'] === 'Other',
                                initialValue: '',
                              },
                            ],
                          }}
                        />
                      )}
                    </div>
                    <div className="flex justify-end my-4">
                      <button
                        disabled={!dirty}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSaveProfile(values, registrationSection, resetForm).then(() => {
                            alert('Profile saved');
                          });
                        }}
                        className="bg-[#40B7BA] rounded-lg p-3 text-white font-bold"
                      >
                        Save Profile
                      </button>
                    </div>
                  </section>
                )}

                {/* Short Answer Questions */}
                {registrationSection == 3 && (
                  <section className="bg-white lg:w-3/5 md:w-3/4 w-full min-h-[35rem] mx-auto rounded-2xl md:py-10 py-6 px-8 mb-8 text-[#4C4950]">
                    <h2 className="sm:text-2xl text-xl poppins-bold sm:mb-3 mb-1 mt-2">
                      Short Answer Questions
                    </h2>
                    <div className="flex flex-col poppins-regular md:px-4">
                      {shortAnswerQuestions.map((obj, idx) => (
                        <DisplayQuestion key={idx} obj={obj} />
                      ))}
                    </div>
                    <div className="flex justify-end my-4">
                      <button
                        disabled={!dirty}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSaveProfile(values, registrationSection, resetForm).then(() => {
                            alert('Profile saved');
                          });
                        }}
                        className="bg-[#40B7BA] rounded-lg p-3 text-white font-bold"
                      >
                        Save Profile
                      </button>
                    </div>
                  </section>
                )}

                {/* Event Questions */}
                {registrationSection == 4 && (
                  <section className="bg-white lg:w-3/5 md:w-3/4 w-full min-h-[35rem] mx-auto rounded-2xl md:py-10 py-6 px-8 mb-8 text-[#4C4950]">
                    <h2 className="sm:text-2xl text-xl poppins-bold sm:mb-3 mb-1 mt-2">
                      Event Info
                    </h2>
                    <div className="flex flex-col poppins-regular md:px-4">
                      {/* apply styling issue fix, it's an ugly fix but this solve the styling issue */}
                      {eventInfoQuestions.map((obj, idx) => {
                        // if (idx !== 0) return <DisplayQuestion key={idx} obj={obj} />;

                        return <DisplayQuestion key={idx} obj={obj} />;
                      })}
                    </div>
                    <div className="flex justify-end my-4">
                      <button
                        disabled={!dirty}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSaveProfile(values, registrationSection, resetForm).then(() => {
                            alert('Profile saved');
                          });
                        }}
                        className="bg-[#40B7BA] rounded-lg p-3 text-white font-bold"
                      >
                        Save Profile
                      </button>
                    </div>
                  </section>
                )}

                {/* Sponsor Questions */}
                {registrationSection == 5 && (
                  <section className="bg-white lg:w-3/5 md:w-3/4 w-full min-h-[35rem] mx-auto rounded-2xl md:py-10 py-6 px-8 mb-8 text-[#4C4950] relative">
                    <h2 className="sm:text-2xl text-xl poppins-bold sm:mb-3 mb-1 mt-2">
                      Sponsor Info
                    </h2>
                    <div className="flex flex-col poppins-regular md:px-4">
                      {sponsorInfoQuestions.map((obj, idx) => (
                        <DisplayQuestion key={idx} obj={obj} />
                      ))}
                    </div>
                    {/* Resume Upload */}
                    <div className="mt-8 md:px-4 poppins-regular">
                      <div className="flex items-center">
                        Upload your resume{' '}
                        <span className="text-gray-600 ml-2 text-[8px]">optional</span>
                      </div>
                      <br />
                      <input
                        onChange={(e) => handleResumeFileChange(e)}
                        name="resume"
                        type="file"
                        formEncType="multipart/form-data"
                        accept=".pdf, .doc, .docx, image/png, image/jpeg, .txt, .tex, .rtf"
                        className="poppins-regular cursor-pointer w-full text-[#4C4950] border border-[#40B7BA] rounded-md file:md:p-2 file:p-1 file:bg-[#40B7BA] file:text-white file:cursor-pointer file:h-full file:rounded-l-md file:border-none"
                      />
                      <br />
                      <p className="poppins-regular text-xs text-[#40B7BA]">
                        Accepted file types: .pdf, .doc, .docx, .png, .jpeg, .txt, .tex, .rtf
                      </p>
                    </div>
                    <div className="flex justify-end my-4">
                      <button
                        disabled={!dirty}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSaveProfile(values, registrationSection, resetForm).then(() => {
                            alert('Profile saved');
                          });
                        }}
                        className="bg-[#40B7BA] rounded-lg p-3 text-white font-bold"
                      >
                        Save Profile
                      </button>
                    </div>
                  </section>
                )}
                {/* Teammate Questions */}
                {registrationSection == 6 && (
                  <section className="bg-white lg:w-3/5 md:w-3/4 w-full min-h-[35rem] mx-auto rounded-2xl md:py-10 py-6 px-8 mb-8 text-[#4C4950]">
                    <h2 className="sm:text-2xl text-xl font-semibold sm:mb-3 mb-1">
                      Teammate Questions
                    </h2>
                    <p className="text-md my-6 font-bold">
                      Emails of teammates should be the same as the email they registered with!
                    </p>
                    <div className="flex flex-col">
                      {teammateQuestions.map((obj, idx) => (
                        <DisplayQuestion key={idx} obj={obj} />
                      ))}
                    </div>

                    {/* Submit */}
                    <div className="mt-8 text-white">
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="mr-auto cursor-pointer px-4 py-2 rounded-lg bg-[#40B7BA] hover:brightness-90"
                      >
                        Submit
                      </button>
                      {!isValid && (
                        <div className="text-red-600 poppins-regular">
                          Error: The form has invalid fields. Please go through the form again to
                          make sure that every required fields are filled out.
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end my-4">
                      <button
                        disabled={!dirty}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSaveProfile(values, registrationSection, resetForm).then(() => {
                            alert('Profile saved');
                          });
                        }}
                        className="bg-[#40B7BA] rounded-lg p-3 text-white font-bold"
                      >
                        Save Profile
                      </button>
                    </div>
                  </section>
                )}
              </Form>

              {/* Pagniation buttons */}
              <section
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                }}
                className={`lg:block ${
                  registrationSection == 0
                    ? 'justify-end'
                    : registrationSection >= 6
                    ? 'justify-start'
                    : 'justify-between'
                } lg:pb-4 pb-8 lg:px-4 sm:px-8 px-6 text-primaryDark font-semibold text-primaryDark font-semibold text-md`}
              >
                {registrationSection > 0 && (
                  <div
                    style={{ gridArea: '1 / 1 / 2 / 2' }}
                    // className="lg:fixed 2xl:bottom-8 2xl:left-8 bottom-6 left-6 inline cursor-pointer select-none"
                    onClick={() => {
                      setRegistrationSection(registrationSection - 1);
                    }}
                  >
                    <div
                      style={{ width: 'fit-content' }}
                      className="cursor-pointer select-none bg-white text-[#40B7BA] rounded-[30px] py-3 pl-2 pr-4 text-xs md:text-lg border-2 border-[#40B7BA]"
                    >
                      <ChevronLeftIcon className="text-[#40B7BA]" />
                      prev page
                    </div>
                  </div>
                )}

                <div
                  className="flex justify-center items-center"
                  style={{ gridArea: '1 / 2 / 2 / 3' }}
                >
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        if (dirty) handleSaveProfile(values, registrationSection, resetForm);
                        setRegistrationSection(i);
                      }}
                      style={{ backgroundColor: registrationSection == i ? '#4C4950' : '#9F9EA7' }}
                      className="rounded-full w-3 h-3 mr-2"
                    />
                  ))}
                </div>

                {registrationSection < 6 && (
                  <div
                    className="flex justify-end "
                    style={{ gridArea: '1 / 3 / 2 / 4' }}
                    onClick={(e) => {
                      e.preventDefault();
                      if (dirty) handleSaveProfile(values, registrationSection, resetForm);
                      setRegistrationSection(registrationSection + 1);
                    }}
                  >
                    <div
                      style={{ width: 'fit-content' }}
                      className="cursor-pointer select-none bg-white text-[#40B7BA] text-xs md:text-lg rounded-[30px] py-3 pr-2 pl-4 border-2 border-[#40B7BA]"
                    >
                      next page
                      <ChevronRightIcon />
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
        </Formik>
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const protocol = context.req.headers.referer?.split('://')[0] || 'http';
  const { data } = await RequestHelper.get<{ allowRegistrations: boolean }>(
    `${protocol}://${context.req.headers.host}/api/registrations/status`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return {
    props: {
      allowedRegistrations: data.allowRegistrations,
    },
  };
};
