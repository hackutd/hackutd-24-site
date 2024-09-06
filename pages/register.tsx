import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
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
import { Snackbar } from '@mui/material';

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

  const { user, profile, partialProfile, hasProfile, updateProfile, updatePartialProfile } =
    useAuthContext();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSavingApplication, setIsSavingApplication] = useState(false);
  const [resumeFileUpdated, setResumeFileUpdated] = useState(false);
  const resumeFileRef = useRef(null);
  const [displayProfileSavedToaster, setDisplayProfileSavedToaster] = useState(false);
  // update this to false for testing
  const [loading, setLoading] = useState(false);
  const [registrationSection, setRegistrationSection] = useState(
    partialProfile?.currentRegistrationPage || 0,
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

  const cleanData = (registrationData: PartialRegistration): Registration => {
    let cleanedValues = { ...registrationData };
    const userValues = {
      id: registrationData.id,
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      preferredEmail: registrationData.preferredEmail,
      permissions: registrationData.permissions,
    };
    delete cleanedValues.firstName;
    delete cleanedValues.lastName;
    delete cleanedValues.permissions;
    delete cleanedValues.preferredEmail;
    return {
      ...cleanedValues,
      user: userValues,
    };
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
    let resumeUrl: string = profile?.resume || '';
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
      } else if (resumeUrl !== '') {
        const { data } = await RequestHelper.post<
          { major: string; studyLevel: string; resumeUrl: string },
          { url: string }
        >(
          '/api/resume/move',
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
          {
            major: registrationData.major,
            studyLevel: registrationData.studyLevel,
            resumeUrl,
          },
        );
        resumeUrl = data.url;
      }
      const { data } = await RequestHelper.post<
        Registration,
        { msg: string; registrationData: Registration }
      >(
        '/api/applications',
        {},
        {
          ...registrationData,
          id: registrationData.id || user.id,
          user: {
            ...registrationData.user,
            id: registrationData.user.id || user.id,
          },
          resume: resumeUrl,
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

  const isValidUSPhoneNumber = (phoneNumber: string) => {
    return /^(1[ -]?)?\d{3}[ -]?\d{3}[ -]?\d{4}$/.test(phoneNumber);
  };

  const isValidInternationalPhoneNumber = (phoneNumber: string) => {
    return /(\+|00)(297|93|244|1264|358|355|376|971|54|374|1684|1268|61|43|994|257|32|229|226|880|359|973|1242|387|590|375|501|1441|591|55|1246|673|975|267|236|1|61|41|56|86|225|237|243|242|682|57|269|238|506|53|5999|61|1345|357|420|49|253|1767|45|1809|1829|1849|213|593|20|291|212|34|372|251|358|679|500|33|298|691|241|44|995|44|233|350|224|590|220|245|240|30|1473|299|502|594|1671|592|852|504|385|509|36|62|44|91|246|353|98|964|354|972|39|1876|44|962|81|76|77|254|996|855|686|1869|82|383|965|856|961|231|218|1758|423|94|266|370|352|371|853|590|212|377|373|261|960|52|692|389|223|356|95|382|976|1670|258|222|1664|596|230|265|60|262|264|687|227|672|234|505|683|31|47|977|674|64|968|92|507|64|51|63|680|675|48|1787|1939|850|351|595|970|689|974|262|40|7|250|966|249|221|65|500|4779|677|232|503|378|252|508|381|211|239|597|421|386|46|268|1721|248|963|1649|235|228|66|992|690|993|670|676|1868|216|90|688|886|255|256|380|598|1|998|3906698|379|1784|58|1284|1340|84|678|681|685|967|27|260|263)(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{4,20}$/.test(
      phoneNumber.replaceAll(' ', ''),
    );
  };

  const handleSaveProfile = (
    registrationData: PartialRegistration,
    nextPage: number,
    resetForm: (param: { values: any }) => void,
  ) => {
    // const cleanedData = cleanData(registrationData);
    return (async () => {
      if (resumeFile && resumeFileUpdated) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('fileName', `${user.id}${getFileExtension(resumeFile.name)}`);
        formData.append('studyLevel', registrationData['studyLevel']);
        formData.append('major', registrationData['major']);
        formData.append('isPartialProfile', 'true');

        const res = await fetch('/api/resume/upload', {
          method: 'post',
          body: formData,
        });
        const resumeUrl = (await res.json()).url;
        return resumeUrl;
      } else {
        return profile?.resume || '';
      }
    })()
      .then((resumeUrl: string) => {
        return RequestHelper.put<any, { msg: string; registrationData: PartialRegistration }>(
          '/api/applications/save',
          {},
          {
            ...registrationData,
            id: registrationData.id || user.id,
            currentRegistrationPage: nextPage,
            resume: resumeUrl,
          },
        )
          .then(() => {
            setDisplayProfileSavedToaster(true);
            resetForm({ values: registrationData });
            setResumeFileUpdated(false);
            updatePartialProfile(registrationData);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        alert('something is wrong with saving profile');
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
    setResumeFileUpdated(true);
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
    <div className="flex flex-col flex-grow mt-28 md:mt-0 ">
      <Head>
        <title>Hacker Application</title>
        <meta name="description" content="Register for HackUTD 2024" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Formik
        initialValues={{
          ...generateInitialValues(partialProfile),
          id: partialProfile?.id || '',
          firstName: partialProfile?.firstName || '',
          lastName: partialProfile?.lastName || '',
          preferredEmail: partialProfile?.preferredEmail || user?.preferredEmail || '',
          majorManual: partialProfile?.majorManual || '',
          universityManual: partialProfile?.universityManual || '',
          heardFromManual: partialProfile?.heardFromManual || '',
          resume: partialProfile?.resume || '',
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

          if (
            !isValidUSPhoneNumber(values['phoneNumber']) &&
            !isValidInternationalPhoneNumber(values['phoneNumber'])
          ) {
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
            <section className="pl-4 relative mb-4 z-[9999] hidden md:flex">
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  if (dirty) await handleSaveProfile(values, registrationSection, resetForm);
                  await router.push('/');
                }}
              >
                <div className="mt-2 cursor-pointer items-center inline-flex text-white font-bold bg-[#40B7BA] rounded-[30px] pr-4 pl-1 py-2 border-2 border-white">
                  <ChevronLeftIcon className="text-white" fontSize={'large'} />
                  Home
                </div>
              </button>
            </section>
            <section className="relative">
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
                        onClick={async (e) => {
                          e.preventDefault();
                          await handleSaveProfile(values, registrationSection, resetForm);
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
                          handleSaveProfile(values, registrationSection, resetForm);
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
                          handleSaveProfile(values, registrationSection, resetForm);
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
                          handleSaveProfile(values, registrationSection, resetForm);
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
                          handleSaveProfile(values, registrationSection, resetForm);
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
                        ref={resumeFileRef}
                        name="resume"
                        type="file"
                        formEncType="multipart/form-data"
                        accept=".pdf, .doc, .docx, image/png, image/jpeg, .txt, .tex, .rtf"
                        className="hidden"
                      />
                      <div className="flex items-center gap-x-3 poppins-regular w-full border border-[#40B7BA] rounded-md">
                        <button
                          className="md:p-2 p-1 bg-[#40B7BA] text-white h-full rounded-l-md border-none"
                          onClick={(e) => {
                            e.preventDefault();
                            resumeFileRef.current?.click();
                          }}
                        >
                          Upload new resume...
                        </button>
                        <p className="text-[#4C4950]">
                          {resumeFile ? resumeFile.name : 'No file selected.'}
                        </p>
                      </div>
                      <p className="poppins-regular text-xs text-[#40B7BA]">
                        Accepted file types: .pdf, .doc, .docx, .png, .jpeg, .txt, .tex, .rtf
                      </p>
                      {profile?.resume && (
                        <div className="my-4 w-fit">
                          <Link href={profile.resume} target="_blank">
                            <div className="bg-[#40B7BA] md:p-2 p-1 text-white rounded-lg">
                              Click to view your current resume
                            </div>
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end my-4">
                      <button
                        disabled={(!dirty && !resumeFileUpdated) || isSavingApplication}
                        onClick={async (e) => {
                          e.preventDefault();
                          setIsSavingApplication(true);
                          await handleSaveProfile(values, registrationSection, resetForm);
                          setIsSavingApplication(false);
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
                          handleSaveProfile(values, registrationSection, resetForm);
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
                      onClick={async (e) => {
                        e.preventDefault();
                        if (isSavingApplication) return;
                        if (dirty || resumeFileUpdated) {
                          setIsSavingApplication(true);
                          await handleSaveProfile(values, registrationSection, resetForm);
                          setIsSavingApplication(false);
                        }
                        setRegistrationSection(i);
                      }}
                      style={{ backgroundColor: registrationSection == i ? '#4C4950' : '#9F9EA7' }}
                      className="rounded-full w-3 h-3 mr-2 cursor-pointer"
                    />
                  ))}
                </div>

                {registrationSection < 6 && (
                  <div
                    className="flex justify-end "
                    style={{ gridArea: '1 / 3 / 2 / 4' }}
                    onClick={async (e) => {
                      e.preventDefault();
                      if (isSavingApplication) {
                        return;
                      }
                      if (dirty || resumeFileUpdated) {
                        setIsSavingApplication(true);
                        await handleSaveProfile(values, registrationSection, resetForm);
                        setIsSavingApplication(false);
                      }
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
              <Snackbar
                open={displayProfileSavedToaster}
                autoHideDuration={5000}
                onClose={() => setDisplayProfileSavedToaster(false)}
                message="Profile saved"
              />
            </section>
          </>
        )}
      </Formik>
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
